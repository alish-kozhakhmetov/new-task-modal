# Phase 2: rebuild each task from its stored fields (as task_controller does) and
# ask the real TaskChecker whether each candidate wire answer is correct.
# Usage: run.sh check.exs cases.json out.json
# cases: [{id, fields, candidates: [{label, wire}]}]
[cases_path, out_path] = System.argv()
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])

cases = cases_path |> File.read!() |> Poison.decode!()

results =
  for c <- cases do
    mod = String.to_atom("Elixir." <> c["id"])
    fields = c["fields"] |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()
    task = Kernel.struct(mod, fields)

    verdicts =
      for cand <- c["candidates"] do
        ok =
          try do
            TaskChecker.user_answer_correct?(task, cand["wire"])
          rescue
            e -> "crash: " <> (Exception.message(e) |> String.slice(0, 120))
          end

        Map.put(cand, "ok", ok)
      end

    c |> Map.delete("fields") |> Map.put("candidates", verdicts)
  end

File.write!(out_path, Poison.encode!(results))
IO.puts("cases: #{length(results)}")
