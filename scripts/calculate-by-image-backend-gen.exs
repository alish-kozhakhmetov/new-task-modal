# calculateByImage tasks built by the monolith's own generators, the way
# GET /lessons/:id/tasks builds them (UserTaskDto: InvokeTask.new → title,
# description, fields, answerInput), plus the raw reference InvokeTask.answer
# as a plain map (structs tagged `_struct`) — the jobs script reads `list`,
# `sortable?` and «any of them» from it.
#
# The production plug (DecimalFormatPlug) sets the separator to :comma before
# generation and check; master's generators depend on it since 24.11. Set here
# for every task, in the process that builds it (wave1-common.md, 27.11 03:42).
#
#   QALAN_BE_MODULES=<common>:<primary> be.sh calculate-by-image-backend-gen.exs <types.txt> <out.jsonl> <seeds> [salt]
# Only tasks whose description is calculateByImage / calculateByImageWithCell
# are written in full; any other type gets a one-line `{type, seed, dtype}`.
[list_file, out_file, k | rest] = System.argv()
k = String.to_integer(k)

salt =
  case rest do
    [x | _] -> String.to_integer(x)
    [] -> 20261127
  end

set_comma = fn ->
  if Code.ensure_loaded?(DecimalFormat),
    do: apply(DecimalFormat, :set_separator, [:comma]),
    else: raise("no DecimalFormat")
end

defmodule CbiPlain do
  def plain(%{__struct__: name} = s) do
    s |> Map.from_struct() |> plain() |> Map.put("_struct", inspect(name))
  end

  def plain(m) when is_map(m), do: Map.new(m, fn {key, v} -> {to_string(key), plain(v)} end)
  def plain(l) when is_list(l), do: Enum.map(l, &plain/1)
  def plain(t) when is_tuple(t), do: t |> Tuple.to_list() |> plain()
  def plain(x), do: x
end

types = File.read!(list_file) |> String.split("\n", trim: true)
{:ok, out} = File.open(out_file, [:write, :utf8])

for type <- types, s <- 1..k do
  set_comma.()
  :rand.seed(:exsss, {s, :erlang.phash2(type), salt})
  mod = String.to_atom("Elixir." <> type)

  line =
    try do
      case Code.ensure_loaded(mod) do
        {:module, _} -> :ok
        err -> raise "not compiled: #{inspect(err)}"
      end

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
          set_comma.()
          :rand.seed(:exsss, {s, :erlang.phash2(type), salt})
          {Kernel.apply(mod, :new, [d]), Atom.to_string(d)}
        end

      description = InvokeTask.description(task)
      # the type as the API spells it: the description's own encoder sets it
      dtype = description |> Poison.encode!() |> Poison.decode!() |> Map.get("type") |> to_string()

      if dtype in ["calculateByImage", "calculateByImageWithCell"] do
        answer =
          try do
            {:ok, InvokeTask.answer(task) |> CbiPlain.plain()}
          rescue
            e -> {:error, Exception.message(e) |> String.slice(0, 200)}
          end

        dto = %{
          id: "img-#{type}-#{s}",
          type: "Elixir." <> type,
          difficulty: difficulty,
          result: "none",
          isPenalty: false,
          position: s,
          attemptsCount: nil,
          title: InvokeTask.title(task),
          description: description,
          fields: task,
          answerInput: InvokeTask.answer_input(task)
        }

        case answer do
          {:ok, a} -> Poison.encode!(%{type: type, seed: s, dtype: dtype, answer: a, task: dto})
          {:error, msg} -> Poison.encode!(%{type: type, seed: s, dtype: dtype, refError: msg, task: dto})
        end
      else
        Poison.encode!(%{type: type, seed: s, dtype: dtype})
      end
    rescue
      e -> Poison.encode!(%{type: type, seed: s, error: Exception.message(e) |> String.slice(0, 300)})
    catch
      kind, v -> Poison.encode!(%{type: type, seed: s, error: "#{kind}: #{inspect(v) |> String.slice(0, 300)}"})
    end

  IO.write(out, line <> "\n")
end

File.close(out)
IO.puts(:stderr, "decimal separator at the end: #{inspect(Process.get(:decimal_separator))}")
