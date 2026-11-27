# The hex package `inflex` (English plurals) is not in the monolith's local
# _build. The task modules call it only through Number.English, i.e. for the
# English text of a task; the window is checked in Russian. A naive stand-in,
# so the generators run — never used to judge English wording.
defmodule Inflex do
  def pluralize(word) when is_binary(word), do: word <> "s"
  def inflect(word, 1), do: word
  def inflect(word, _n), do: pluralize(word)
end
