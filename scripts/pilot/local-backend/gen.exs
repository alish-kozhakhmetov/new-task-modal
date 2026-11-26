# Local stand-in for the backend while test.qalan.kz is down: the
# generators compiled from the monolith's sources, a task built the way
# GET /lessons/:id/tasks builds it (UserTaskDto: InvokeTask.new → title,
# description, fields, answerInput; Poison like the API), and the reference
# the sandbox would answer (`answerString`: InvokeTask.answer, lists joined
# by « || »).
#
#   elixir -pa <ebins> gen.exs <types.txt> <out.jsonl> <samples>
[list_file, out_file, k] = System.argv()
k = String.to_integer(k)
types = File.read!(list_file) |> String.split("\n", trim: true)
{:ok, out} = File.open(out_file, [:write, :utf8])

answer_string = fn task ->
  answer = InvokeTask.answer(task)
  if is_list(answer), do: Enum.map_join(answer, " || ", &to_string/1), else: to_string(answer)
end

for type <- types, s <- 1..k do
  :rand.seed(:exsss, {s, :erlang.phash2(type), 20261126})
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
          :rand.seed(:exsss, {s, :erlang.phash2(type), 20261126})
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
