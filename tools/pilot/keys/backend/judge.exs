# KEYS 27.11: candidates typed into MathQuill → the backend's TaskChecker on
# the very task they came from (hs + common). Plus a mutation per sample: a
# wrong keys answer of the same shape must be rejected; and the reference
# itself, as the backend prints it (refOk false — the backend's own gap).
#   be.sh -pa <hs> tools/pilot/keys/backend/judge.exs <cands.jsonl> <verdicts.jsonl>
[in_file, out_file] = System.argv()
# the rebuild below runs here, the checks in their own Tasks: :comma in both
DecimalFormat.set_separator(:comma)
{:ok, out} = File.open(out_file, [:write, :utf8])
digit = fn s ->
  case Regex.run(~r/\d/, s, return: :index) do
    [{i, 1}] ->
      d = String.at(s, i) |> String.to_integer()
      String.slice(s, 0, i) <> Integer.to_string(rem(d + 1, 10)) <> String.slice(s, (i + 1)..-1//1)
    _ -> s <> "9"
  end
end
# a wrong answer of the same shape: sin↔cos, π→2π, else a digit changed
mutate = fn s ->
  cond do
    String.contains?(s, "\\sin") or String.contains?(s, "\\cos") ->
      s |> String.replace("\\sin", "\\SIN") |> String.replace("\\cos", "\\sin") |> String.replace("\\SIN", "\\cos")
    String.contains?(s, "\\pi") -> String.replace(s, "\\pi", "2\\pi", global: false)
    true -> digit.(s)
  end
end
check = fn t, ans ->
  task = Task.async(fn ->
    DecimalFormat.set_separator(:comma)
    try do
      TaskChecker.user_answer_correct?(t, ans)
    rescue
      e -> "crash: " <> String.slice(Exception.message(e), 0, 120)
    catch
      k, v -> "#{k}: " <> String.slice(inspect(v), 0, 120)
    end
  end)
  case Task.yield(task, 4000) || Task.shutdown(task, :brutal_kill) do
    {:ok, v} -> v
    _ -> "timeout"
  end
end
n =
  File.stream!(in_file)
  |> Enum.reduce(0, fn line, n ->
    r = Poison.decode!(line)
    # the struct the API checks: rebuilt from the fields the window sends back
    t =
      case r do
        %{"fields" => f} when is_binary(f) ->
          Kernel.struct(
            String.to_atom("Elixir." <> r["id"]),
            f |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()
          )
        _ -> r["task"] |> Base.decode64!() |> :erlang.binary_to_term()
      end
    ok = for {name, ans} <- r["cands"], name != "no_key", into: %{}, do: {name, check.(t, ans)}
    wrong = if r["cands"]["keys"], do: check.(t, mutate.(r["cands"]["keys"])), else: nil
    # the reference itself, as the backend prints it: false — the backend's own gap, not the keys'
    ref_ok = check.(t, r["ref"])
    IO.write(out, Poison.encode!(%{id: r["id"], i: r["i"], ref: r["ref"], cands: r["cands"], ok: ok, wrong: wrong, refOk: ref_ok}) <> "\n")
    n + 1
  end)
File.close(out)
IO.puts("judged #{n}")
