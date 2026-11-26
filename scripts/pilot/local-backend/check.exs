# The sandbox's check, locally: POST /tasks/testing<n>/answers does
# TaskConverters.from_string_fields_to_atom_fields(fields) → struct of the
# type → TaskChecker.user_answer_correct?(task, answer). Same here, for a
# JSONL of {key, type, fields, answer}; result 30 = correct, like the API,
# and `answerString` — the reference the sandbox answers with.
#
#   elixir -pa <ebins> check.exs <in.jsonl> <out.jsonl>
[in_file, out_file] = System.argv()
# Kazakhstan request process: DecimalFormatPlug sets :comma before generation and check;
# the separator lives in this process's dictionary (no Task.async here or in the generators).
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])
{:ok, out} = File.open(out_file, [:write, :utf8])

File.stream!(in_file)
|> Enum.each(fn line ->
  job = Poison.decode!(line)

  res =
    try do
      fields = TaskConverters.from_string_fields_to_atom_fields(job["fields"])
      task = job["type"] |> String.to_atom() |> Kernel.struct(fields)
      ok = TaskChecker.user_answer_correct?(task, job["answer"])
      # the sandbox's `answerString` (InvokeTask.answer, lists joined by « || »)
      answer = InvokeTask.answer(task)
      ref = if is_list(answer), do: Enum.map_join(answer, " || ", &to_string/1), else: to_string(answer)
      %{key: job["key"], result: if(ok, do: 30, else: 20), answerString: ref}
    rescue
      e -> %{key: job["key"], error: Exception.message(e) |> String.slice(0, 200)}
    catch
      kind, v -> %{key: job["key"], error: "#{kind}: #{inspect(v) |> String.slice(0, 200)}"}
    end

  IO.write(out, Poison.encode!(res) <> "\n")
end)

File.close(out)
