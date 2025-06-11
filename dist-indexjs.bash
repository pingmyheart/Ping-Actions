#!/bin/bash
current_dir=$(pwd)
for index in $(find ./ | grep index.js | grep -v dist | grep -v node_modules); do
  echo "Processing $index"
  dir=$(dirname "$index")
  # shellcheck disable=SC2164
  cd "$dir"
  ncc build index.js --license licenses.txt
  # shellcheck disable=SC2164
  cd "$current_dir"
done