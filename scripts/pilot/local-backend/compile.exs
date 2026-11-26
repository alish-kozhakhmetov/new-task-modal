# Compile a source tree of the monolith into <dest> with today's Elixir,
# dropping the files today's compiler refuses (old unicode identifiers and
# the like) and retrying, so one bad helper does not hold back the rest.
#
#   elixir -pa <dep ebins> compile.exs <src dir> <dest> <log>
[src, dest, log_file] = System.argv()
File.mkdir_p!(dest)
Code.prepend_path(dest)
files = Path.wildcard(Path.join(src, "**/*.ex"))
{:ok, log} = File.open(log_file, [:write, :utf8])
IO.puts(log, "files: #{length(files)}")

loop = fn loop, files, dropped, round ->
  res = Kernel.ParallelCompiler.compile_to_path(files, dest, return_diagnostics: true)

  case res do
    {:ok, mods, _} ->
      IO.puts(log, "round #{round}: ok, modules #{length(mods)}, dropped #{length(dropped)}")
      {mods, dropped}

    {:error, errors, _} ->
      bad =
        errors
        |> Enum.map(fn d -> d.file end)
        |> Enum.filter(& &1)
        |> Enum.map(&Path.expand/1)
        |> MapSet.new()

      for d <- errors, do: IO.puts(log, "round #{round}: #{d.file}: #{String.slice(to_string(d.message), 0, 160)}")
      rest = Enum.reject(files, &MapSet.member?(bad, Path.expand(&1)))

      if MapSet.size(bad) == 0 or round > 30 do
        IO.puts(log, "giving up at round #{round}")
        {[], dropped}
      else
        loop.(loop, rest, dropped ++ MapSet.to_list(bad), round + 1)
      end
  end
end

{mods, dropped} = loop.(loop, files, [], 1)
IO.puts(log, "modules: #{length(mods)}; dropped files: #{length(dropped)}")
for f <- dropped, do: IO.puts(log, "dropped #{f}")
File.close(log)
