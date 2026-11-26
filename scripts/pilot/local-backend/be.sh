#!/bin/bash
# elixir with the monolith's deps and the locally compiled task modules:
#   scripts/pilot/local-backend/be.sh <script.exs> args…
set -eu
export PATH=/opt/homebrew/opt/erlang/bin:$PATH
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
B="${QALAN_MONOLITH:-$HOME/Documents/Projects/qalan/matheducator-student-platform}/matheducator_task_common/_build/dev/lib"
PA=()
for d in certifi decimal hackney httpoison idna metrics mimerl parse_trans poison ssl_verify_fun unicode_util_compat; do PA+=(-pa "$B/$d/ebin"); done
exec elixir "${PA[@]}" -pa "$ROOT/.pilot-cache/g3-backend/common" -pa "$ROOT/.pilot-cache/g3-backend/g3" "$@"
