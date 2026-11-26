# Phase 1: generate tasks the way the API does and record what the checker accepts.
# Usage: run.sh gen.exs targets.json seeds out.json
[targets_path, seeds_s, out_path] = System.argv()
seeds = String.to_integer(seeds_s)
# Kazakhstan request process: DecimalFormatPlug sets :comma before generation and check.
if Code.ensure_loaded?(DecimalFormat), do: apply(DecimalFormat, :set_separator, [:comma])

defmodule Ser do
  def str(x) do
    try do
      to_string(x)
    rescue
      _ -> "<no to_string>"
    end
  end

  def s(%Fraction{} = f),
    do: %{k: "fraction", sign: f.sign, integer: f.integer, a: f.a, b: f.b, str: str(f)}

  def s(%MyDecimal{} = d), do: %{k: "mydecimal", str: str(d)}
  def s(%Decimal{} = d), do: %{k: "decimal", str: Decimal.to_string(d)}
  def s(x) when is_integer(x), do: %{k: "int", v: x, str: str(x)}
  def s(x) when is_float(x), do: %{k: "float", v: x, str: str(x)}
  def s(x) when is_binary(x), do: %{k: "str", v: x, str: x}
  def s(nil), do: %{k: "nil", str: ""}

  def s(%TaskAnswers.TwoAnswersTaskAnswer{answer1: a, answer2: b} = t),
    do: %{k: "two", parts: [s(a), s(b)], str: str(t)}

  def s(%MultipleTaskAnswer{} = m),
    do: %{k: "multiple", parts: Enum.map(MultipleTaskAnswer.answers(m), &s/1), str: str(m)}

  def s(%TaskAnswers.AnyOfThemTaskAnswer{} = m),
    do: %{k: "anyof", parts: Enum.map(TaskAnswers.AnyOfThemTaskAnswer.answers(m), &s/1)}

  def s(l) when is_list(l), do: %{k: "list", parts: Enum.map(l, &s/1)}

  def s(%EquationSystemsTaskAnswer{answers: a} = e),
    do: %{k: "eqsys", pairs: Enum.map(a, fn {x, y} -> [s(x), s(y)] end), str: str(e)}

  def s(%PeriodicNumber{} = p),
    do: %{
      k: "periodic",
      sign: p.sign,
      integer: p.integer_part,
      decimals: p.decimal_digits,
      period: p.periodic_digits,
      str: str(p)
    }

  def s(%{__struct__: mod} = other),
    do: %{k: "struct", mod: inspect(mod), inspect: inspect(other, limit: 30, printable_limit: 300), str: str(other)}

  def s(other), do: %{k: "raw", inspect: inspect(other, limit: 30), str: str(other)}
end

targets = targets_path |> File.read!() |> Poison.decode!()

rows =
  for t <- targets, seed <- 1..seeds do
    id = t["id"]
    diff = t["difficulty"]
    mod = String.to_atom("Elixir." <> id)
    :rand.seed(:exsss, {seed, 7, 11})

    try do
      task =
        case diff do
          nil -> mod.new()
          d -> mod.new(String.to_atom(d))
        end

      # fields as the API stores and returns them (Poison), rebuilt as the controller does
      fields_json = task |> Map.from_struct() |> Poison.encode!()
      fields = fields_json |> Poison.decode!() |> TaskConverters.from_string_fields_to_atom_fields()
      rebuilt = Kernel.struct(mod, fields)
      answer = InvokeTask.answer(rebuilt)

      ai =
        try do
          InvokeTask.answer_input(rebuilt) |> Map.from_struct() |> Map.take([:before, :after, :type])
        rescue
          _ -> %{}
        end

      dtype =
        try do
          d = InvokeTask.description(rebuilt)
          to_string(Map.get(d, :type) || Map.get(d, "type"))
        rescue
          _ -> "?"
        end

      %{
        id: id,
        seed: seed,
        difficulty: diff,
        codes: t["codes"],
        fields: fields_json,
        answer: Ser.s(answer),
        answerInput: ai,
        descType: dtype
      }
    rescue
      e -> %{id: id, seed: seed, codes: t["codes"], error: Exception.message(e) |> String.slice(0, 300)}
    end
  end

File.write!(out_path, Poison.encode!(rows))
IO.puts("rows: #{length(rows)}, errors: #{Enum.count(rows, &Map.has_key?(&1, :error))}")
