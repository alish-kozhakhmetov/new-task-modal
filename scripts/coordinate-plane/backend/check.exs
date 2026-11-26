# The real TaskChecker on the answers the prototype's window would send.
#
#   QALAN_BE_MODULES=<master>/be/common:<master>/be/hs be.sh \
#     scripts/coordinate-plane/backend/check.exs candidates.jsonl verdicts.jsonl
#
# candidates.jsonl (build-fixtures.ts `tasks`): {id, fields, wire, label}. The
# task is rebuilt from `fields` exactly as task_controller does for a stored
# task, `wire` is the answer as it arrives from JSON (a string for a point, a
# map for dots and figures), and the verdict is user_answer_correct?/2.
[in_file, out_file] = System.argv()
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])

File.write!(out_file, "")

for line <- File.read!(in_file) |> String.split("\n", trim: true) do
  c = Poison.decode!(line)
  mod = String.to_atom("Elixir." <> c["id"])
  fields = c["fields"] |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()
  task = Kernel.struct(mod, fields)

  verdict =
    try do
      TaskChecker.user_answer_correct?(task, c["wire"])
    rescue
      e -> "raise: " <> (Exception.message(e) |> String.slice(0, 120))
    end

  out = c |> Map.delete("fields") |> Map.put("verdict", verdict)
  File.write!(out_file, Poison.encode!(out) <> "\n", [:append])
end
