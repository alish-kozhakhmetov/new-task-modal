# The sandbox's check, locally, for the records of
# `lib/backend-window-answers.test.tsx`: POST /tasks/testing<n>/answers does
# TaskConverters.from_string_fields_to_atom_fields(fields) → struct of the
# type → TaskChecker.user_answer_correct?(task, answer). Result 30 = correct,
# 20 = not, like the API; `expect` is passed through.
#
# The separator is :comma, as DecimalFormatPlug sets it on production, in
# the process that checks, before every record (wave1-common.md, 27.11 03:42).
#
#   QALAN_BE_MODULES=<common>:<primary> be.sh calculate-by-image-backend-check.exs <jobs.jsonl> <out.jsonl>
[in_file, out_file] = System.argv()
{:ok, out} = File.open(out_file, [:write, :utf8])

File.stream!(in_file)
|> Stream.reject(&(String.trim(&1) == ""))
|> Enum.each(fn line ->
  job = Poison.decode!(line)
  apply(DecimalFormat, :set_separator, [:comma])

  res =
    try do
      fields = TaskConverters.from_string_fields_to_atom_fields(job["fields"])
      task = job["type"] |> String.to_atom() |> Kernel.struct(fields)
      ok = TaskChecker.user_answer_correct?(task, job["answer"])
      %{key: job["key"], expect: job["expect"], result: if(ok, do: 30, else: 20)}
    rescue
      e -> %{key: job["key"], expect: job["expect"], error: Exception.message(e) |> String.slice(0, 200)}
    catch
      kind, v -> %{key: job["key"], expect: job["expect"], error: "#{kind}: #{inspect(v) |> String.slice(0, 200)}"}
    end

  IO.write(out, Poison.encode!(res) <> "\n")
end)

File.close(out)
IO.puts(:stderr, "decimal separator at the end: #{inspect(Process.get(:decimal_separator))}")
