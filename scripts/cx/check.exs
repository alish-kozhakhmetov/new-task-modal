# Phase 2: rebuild each task from its stored fields (as task_controller does) and
# ask the real TaskChecker whether each candidate wire answer is correct.
# Usage: be.sh scripts/cx/check.exs cases.json out.json  (copied from ntm-ans/scripts/backend-answer-verdicts, 26.11)
# cases: [{id, fields, candidates: [{label, wire}]}]
[cases_path, out_path] = System.argv()
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])

cases = cases_path |> File.read!() |> Poison.decode!()

results =
  for c <- cases do
    mod = String.to_atom("Elixir." <> c["id"])
    fields = c["fields"] |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()

    # a backend without this generator (another branch's build) answers for
    # the case, not for the whole run
    task =
      if Code.ensure_loaded?(mod) and function_exported?(mod, :__struct__, 0),
        do: Kernel.struct(mod, fields),
        else: nil

    verdicts =
      for cand <- c["candidates"] do
        ok =
          if task == nil do
            "no module"
          else
            try do
              TaskChecker.user_answer_correct?(task, cand["wire"])
            rescue
              e -> "crash: " <> (Exception.message(e) |> String.slice(0, 120))
            end
          end

        Map.put(cand, "ok", ok)
      end

    c |> Map.delete("fields") |> Map.put("candidates", verdicts)
  end

File.write!(out_path, Poison.encode!(results))
IO.puts("cases: #{length(results)}")
