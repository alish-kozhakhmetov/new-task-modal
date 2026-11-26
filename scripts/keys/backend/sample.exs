# KEYS 27.11: samples of generators from the local backend (hs + common).
# Each sample in its own process with a 4 s cap (some generators loop), the
# decimal separator set to comma inside it (Process dictionary, Kazakhstan).
#   be.sh -pa <hs> scripts/keys/backend/sample.exs <ids.txt> <out.jsonl> <seeds> [dto]
[ids_file, out_file, n | rest] = System.argv()
n = String.to_integer(n)
dto? = rest == ["dto"]
ids = ids_file |> File.read!() |> String.split("\n", trim: true)
{:ok, out} = File.open(out_file, [:write, :utf8])

str = fn a ->
  try do
    to_string(a)
  rescue
    _ -> nil
  end
end

kind = fn
  l when is_list(l) -> "list"
  %{__struct__: s} -> s |> to_string() |> String.replace("Elixir.", "")
  b when is_binary(b) -> "binary"
  x when is_integer(x) -> "integer"
  _ -> "other"
end

one = fn id, s ->
  DecimalFormat.set_separator(:comma)
  :rand.seed(:exsss, {s, :erlang.phash2(id), 20261127})
  mod = String.to_atom("Elixir." <> id)
  {:module, _} = Code.ensure_loaded(mod)
  fns = mod.__info__(:functions)
  t =
    cond do
      Keyword.get_values(fns, :new) |> Enum.member?(0) -> apply(mod, :new, [])
      Keyword.get_values(fns, :new) |> Enum.member?(1) -> apply(mod, :new, [:x1])
      true -> raise "no new"
    end
  a = InvokeTask.answer(t)
  refs = if is_list(a), do: Enum.map(a, str), else: [str.(a)]
  base = %{id: id, i: s, kind: kind.(a), refs: refs, task: Base.encode64(:erlang.term_to_binary(t))}
  if dto? do
    Map.merge(base, %{
      dto: %{
        type: "Elixir." <> id,
        title: InvokeTask.title(t),
        description: InvokeTask.description(t),
        fields: t,
        answerInput: InvokeTask.answer_input(t)
      }
    })
  else
    base
  end
end

{ok, bad} =
  for id <- ids, s <- 1..n, reduce: {0, 0} do
    {ok, bad} ->
      task = Task.async(fn ->
        try do
          {:ok, Poison.encode!(one.(id, s))}
        rescue
          e -> {:error, Exception.message(e) |> String.slice(0, 160)}
        catch
          k, v -> {:error, "#{k}: #{inspect(v) |> String.slice(0, 160)}"}
        end
      end)
      case Task.yield(task, 4000) || Task.shutdown(task, :brutal_kill) do
        {:ok, {:ok, line}} ->
          IO.write(out, line <> "\n")
          {ok + 1, bad}
        {:ok, {:error, msg}} ->
          IO.write(out, Poison.encode!(%{id: id, i: s, error: msg}) <> "\n")
          {ok, bad + 1}
        nil ->
          IO.write(out, Poison.encode!(%{id: id, i: s, error: "timeout 4s"}) <> "\n")
          {ok, bad + 1}
        {:exit, r} ->
          IO.write(out, Poison.encode!(%{id: id, i: s, error: "exit #{inspect(r) |> String.slice(0, 120)}"}) <> "\n")
          {ok, bad + 1}
      end
  end

File.close(out)
IO.puts("samples ok #{ok}, failed #{bad}")
