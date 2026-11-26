#!/bin/bash
# elixir with the monolith's deps and the locally compiled task modules:
#   scripts/pilot/local-backend/be.sh <script.exs> args…
# The modules, once (≈3 min, from a clone of the monolith; nothing there changes):
#   M=~/Documents/Projects/qalan/matheducator-student-platform
#   be.sh scripts/pilot/local-backend/compile.exs $M/matheducator_task_common/lib .pilot-cache/g3-backend/common common.log
#   elixirc -o .pilot-cache/g3-backend/common scripts/pilot/local-backend/stubs/inflex.ex
#   be.sh scripts/pilot/local-backend/compile.exs $M/primary_school_tasks/lib .pilot-cache/g3-backend/g3 g3.log
set -eu
export PATH=/opt/homebrew/opt/erlang/bin:$PATH
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
B="${QALAN_MONOLITH:-$HOME/Documents/Projects/qalan/matheducator-student-platform}/matheducator_task_common/_build/dev/lib"
PA=()
for d in certifi decimal hackney httpoison idna metrics mimerl parse_trans poison ssl_verify_fun unicode_util_compat; do PA+=(-pa "$B/$d/ebin"); done
# QALAN_BE_MODULES=<dir>:<dir>…: other compiled modules in place of G3's two
# (e.g. a build of origin/master: its own common and high school), same order
IFS=: read -r -a MODS <<< "${QALAN_BE_MODULES:-$ROOT/.pilot-cache/g3-backend/common:$ROOT/.pilot-cache/g3-backend/g3}"
for m in "${MODS[@]}"; do PA+=(-pa "$m"); done
exec elixir "${PA[@]}" "$@"
