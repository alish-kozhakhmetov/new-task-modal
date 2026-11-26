# Coordinate-plane tasks as the API gives them, from the local backend (G3's
# be.sh: the monolith's generators and TaskChecker, no test server).
#
#   be.sh -pa ~/Documents/Projects/qalan/local-backend/hs \
#     scripts/coordinate-plane/backend/gen.exs ids.txt gen.jsonl [seeds]
#
# `seeds` — comma-separated, default `1`; 27.11 the corpus is `1,2,3`
# (`:rand.seed(:exsss, {seed, 7, 11})` before each generator). The task is
# rebuilt from its Poison-encoded fields as task_controller does, and every
# payload is taken from the rebuilt task — what the pupil's window receives.
# `fields` is kept so check.exs judges the very same task.
{ids_file, out_file, seeds} =
  case System.argv() do
    [i, o] -> {i, o, [1]}
    [i, o, s] -> {i, o, s |> String.split(",", trim: true) |> Enum.map(&String.to_integer/1)}
  end
# the Kazakhstan request: DecimalFormatPlug sets :comma before generation and check
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])

defmodule Plain do
  def to(%{__struct__: s} = m) when s in [Decimal], do: Decimal.to_float(m)

  def to(%{__struct__: s} = m) do
    name = s |> Atom.to_string() |> String.replace_prefix("Elixir.", "")
    m |> Map.from_struct() |> Enum.map(fn {k, v} -> {to_string(k), to(v)} end) |> Map.new() |> Map.put("_struct", name)
  end

  # A map holding both :figures and "figures" (CoordinatePlane.new): the atom
  # key carries the camelized list the API fixtures show.
  def to(m) when is_map(m) do
    strs = m |> Enum.filter(fn {k, _} -> is_binary(k) end)
    atoms = m |> Enum.filter(fn {k, _} -> is_atom(k) end)
    (strs ++ atoms) |> Enum.map(fn {k, v} -> {to_string(k), to(v)} end) |> Map.new()
  end

  def to(l) when is_list(l), do: Enum.map(l, &to/1)
  def to(t) when is_tuple(t), do: t |> Tuple.to_list() |> to()
  def to(a) when is_atom(a) and a not in [nil, true, false], do: Atom.to_string(a)
  def to(x), do: x
end

File.write!(out_file, "")

for id <- File.read!(ids_file) |> String.split("\n", trim: true), seed <- seeds do
  mod = String.to_atom("Elixir." <> id)

  res =
    try do
      Code.ensure_loaded!(mod)
      :rand.seed(:exsss, {seed, 7, 11})

      {diff, task} =
        if function_exported?(mod, :new, 0), do: {nil, mod.new()}, else: {"x1", mod.new(:x1)}

      fields_json = task |> Map.from_struct() |> Poison.encode!()
      fields = fields_json |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()
      task = Kernel.struct(mod, fields)
      answer = InvokeTask.answer(task)

      %{
        "id" => id,
        "seed" => seed,
        "difficulty" => diff,
        "type" => "Elixir." <> id,
        "fields" => fields_json,
        "title" => Plain.to(InvokeTask.title(task)),
        "description" => Plain.to(InvokeTask.description(task)),
        "answerInput" => Plain.to(InvokeTask.answer_input(task)),
        "answer" => Plain.to(answer),
        "answerType" =>
          (case answer do
             %{__struct__: s} -> Atom.to_string(s) |> String.replace_prefix("Elixir.", "")
             l when is_list(l) -> "list"
             _ -> "plain"
           end),
        "solution" =>
          (try do
             Plain.to(InvokeTask.solution(task))
           rescue
             _ -> nil
           end)
      }
    rescue
      e -> %{"id" => id, "seed" => seed, "error" => Exception.message(e) |> String.slice(0, 300)}
    end

  File.write!(out_file, Poison.encode!(res) <> "\n", [:append])
end
