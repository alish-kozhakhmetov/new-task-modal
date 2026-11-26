# Local stand-in for the backend while test.qalan.kz is down: the
# generators compiled from the monolith's sources, a task built the way
# GET /lessons/:id/tasks builds it (UserTaskDto: InvokeTask.new → title,
# description, fields, answerInput; Poison like the API), and the reference
# the sandbox would answer (`answerString`: InvokeTask.answer, lists joined
# by « || »).
#
#   elixir -pa <ebins> gen.exs <types.txt> <out.jsonl> <samples> [salt]
# salt: the seeds' third part (default 20261126, G3's run); another salt, other samples
[list_file, out_file, k | rest] = System.argv()
k = String.to_integer(k)
salt = case rest do
  [x | _] -> String.to_integer(x)
  [] -> 20261126
end
# The decimal separator lives in the process dictionary (DecimalFormat,
# default :dot); prod's DecimalFormatPlug sets :comma for Kazakhstan before
# the task is generated and before it is checked, and generators since the
# «task fixes» of 24.11 depend on it. Everything here runs in this one
# process, so it is set once; a spawned Task would need its own call.
# QALAN_DECIMAL_SEPARATOR=dot gives the module's default instead.
sep =
  case System.get_env("QALAN_DECIMAL_SEPARATOR", "comma") do
    "comma" -> :comma
    "dot" -> :dot
    other -> raise "QALAN_DECIMAL_SEPARATOR is comma or dot, not #{other}"
  end

if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [sep])
IO.puts(:stderr, "decimal separator: #{inspect(if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :get_separator, []), else: :no_decimal_format)}")

types = File.read!(list_file) |> String.split("\n", trim: true)
{:ok, out} = File.open(out_file, [:write, :utf8])

answer_string = fn task ->
  answer = InvokeTask.answer(task)
  if is_list(answer), do: Enum.map_join(answer, " || ", &to_string/1), else: to_string(answer)
end

for type <- types, s <- 1..k do
  :rand.seed(:exsss, {s, :erlang.phash2(type), salt})
  mod = String.to_atom("Elixir." <> type)

  line =
    try do
      case Code.ensure_loaded(mod) do
        {:module, _} -> :ok
        err -> raise "not compiled: #{inspect(err)}"
      end

      # a lesson keeps the task's difficulty (UserTaskDto → InvokeTask.new(type,
      # difficulty)); generators without new/0 take one of :x1…:x40 — the
      # sample's own one, the next that the generator accepts
      {task, difficulty} =
        if function_exported?(mod, :new, 0) do
          {Kernel.apply(mod, :new, []), nil}
        else
          levels = for i <- 1..40, do: String.to_atom("x#{i}")
          ok =
            Enum.filter(levels, fn d ->
              try do
                Kernel.apply(mod, :new, [d])
                true
              rescue
                FunctionClauseError -> false
              end
            end)

          if ok == [], do: raise("no new/0 and no difficulty :x1…:x40")
          d = Enum.at(ok, rem(s - 1, length(ok)))
          :rand.seed(:exsss, {s, :erlang.phash2(type), salt})
          {Kernel.apply(mod, :new, [d]), Atom.to_string(d)}
        end

      dto = %{
        id: "g3-#{type}-#{s}",
        type: "Elixir." <> type,
        difficulty: difficulty,
        result: "none",
        isPenalty: false,
        position: s,
        attemptsCount: nil,
        title: InvokeTask.title(task),
        description: InvokeTask.description(task),
        fields: task,
        answerInput: InvokeTask.answer_input(task)
      }

      ref =
        try do
          answer_string.(task)
        rescue
          e -> {:error, Exception.message(e) |> String.slice(0, 200)}
        end

      case ref do
        {:error, msg} -> Poison.encode!(%{type: type, seed: s, refError: msg, task: dto})
        ref -> Poison.encode!(%{type: type, seed: s, answerString: ref, task: dto})
      end
    rescue
      e -> Poison.encode!(%{type: type, seed: s, error: (Exception.message(e) |> String.slice(0, 300))})
    catch
      kind, v -> Poison.encode!(%{type: type, seed: s, error: "#{kind}: #{inspect(v) |> String.slice(0, 300)}"})
    end

  IO.write(out, line <> "\n")
end

File.close(out)
