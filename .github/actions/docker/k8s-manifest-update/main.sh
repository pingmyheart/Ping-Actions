#!/usr/bin/env bash
set -e


### Trap signals
signal_exit() {
  local l_signal
  l_signal="$1"

  case "$l_signal" in
  INT)
    error_exit "Program interrupted by user"
    ;;
  TERM)
    error_exit "Program terminated"
    ;;
  *)
    error_exit "Terminating on unknown signal"
    ;;
  esac
}

trap "signal_exit TERM" TERM HUP
trap "signal_exit INT" INT

### Const
readonly PROGRAM_NAME=${0##*/}
readonly PROGRAM_VERSION="1.0.0"
readonly EXTERNAL_BINARIES="yq sed"
readonly EXTERNAL_SOURCES="base_source.sh"

### Args
LOG_LEVEL="STABLE"
COUNTRY="."
ENVIRONMENT="dev"
FARM="."
REPO_NAME=""
BASE_PATH="."
CONTAINER_IMAGE=""

### Welcome
printf "Hello %s - Welcome to %s v%s\n" "$(whoami)" "$PROGRAM_NAME" "$PROGRAM_VERSION"

# Helpers
clean_up() {
  return
}

error_exit() {
  local l_error_message
  l_error_message="$1"

  printf "[ERROR] - %s\n" "${l_error_message:-'Unknown Error'}" >&2
  echo "Exiting with exit code 1"
  clean_up
  exit 1
}

graceful_exit() {
  clean_up
  exit 0
}

load_libraries() {
  for _ext_bin in $EXTERNAL_BINARIES; do
    if ! hash "$_ext_bin" &>/dev/null; then
      error_exit "Required binary $_ext_bin not found."
    fi
  done
}

load_sources() {
  for _ext_src in $EXTERNAL_SOURCES; do
    # shellcheck disable=SC1090
    if bash $_ext_src --check &>/dev/null; then
      source $_ext_src
      echo "Loaded $_ext_src"
    else
      error_exit "[$_ext_src] - Check library returned non-zero code"
    fi
  done
}

help_message() {
  cat <<-_EOF_

Description  : Update K8s manifest file image managing the case of multi-country deployment
               and multi-farm deployment with the same repo name
Example usage:

Options:
  [-h | --help]                      Display this help message
  [-v | --verbose]        (OPTIONAL) More verbose output
  [--trace]               (OPTIONAL) Set -o xtrace
  [--version]                        Show program version
_EOF_
  return
}

### Func
log_debug() {
  local l_message
  l_message="$1"

  if [ $LOG_LEVEL == "DEBUG" ]; then
    echo "[DEBUG] - $l_message"
  fi
}

log_info() {
  local l_message
  l_message="$1"
  echo "[INFO] - $l_message"
}

log_error() {
  local l_message
  l_message="$1"
  echo "[ERROR] - $l_message"
}

ask_user_permission() {
  local l_message
  l_message="$1"

  printf "%s (y/n): " "$l_message"

  local l_continue
  read -r l_continue

  if [ "$l_continue" == "y" ]; then
    echo "OK"
  elif [ "$l_continue" == "n" ]; then
    graceful_exit
  else
    echo "Invalid choice [$l_continue]! Retrying..."
    ask_user_permission "$l_message"
  fi
}

### Check binaries
load_libraries

### Parse args
while [[ -n "$1" ]]; do
  case "$1" in
  -h | --help)
    help_message
    graceful_exit
    ;;
  -v | --verbose)
    LOG_LEVEL="DEBUG"
    ;;
  --trace)
    set -o xtrace
    ;;
  --version)
    printf "Running version: %s\n" "$PROGRAM_VERSION"
    graceful_exit
    ;;
  --country)
    COUNTRY="$2"
    ;;
  --environment)
    ENVIRONMENT="$2"
    ;;
  --farm)
    FARM="$2"
    ;;
  --repo-name)
    REPO_NAME="$2"
    ;;
  --base-path)
    BASE_PATH="$2"
    ;;
  --container-image)
    CONTAINER_IMAGE="$2"
    ;;
  --* | -*)
    usage >&2
    error_exit "Unknown option $1"
    ;;
  esac
  shift
done

### Checking args

### Main logic
# define a key value map for kind to its corresponding spec path
declare -A kind_to_spec_path=(
  ["Deployment"]="spec.template.spec"
  ["StatefulSet"]="spec.template.spec"
  ["DaemonSet"]="spec.template.spec"
  ["Job"]="spec.template.spec"
  ["CronJob"]="spec.jobTemplate.spec.template.spec"
  ["Pod"]="spec"
)

# define file path to mainfest
manifest_path="${BASE_PATH}/${COUNTRY}/${ENVIRONMENT}/${FARM}/app/${REPO_NAME}/deploy/deployment.yaml"

# obtain the kind and spec path for container from the manifest
kind=$(yq e '.kind' "$manifest_path")
spec_path="${kind_to_spec_path[Deployment]}"

# obtain container index from manifest using container name
container_index=$(yq e ".${spec_path}.containers | map(select(.name == \"${REPO_NAME}\")) | keys[0]" "$manifest_path")

# update container image in manifest
yq e -i ".${spec_path}.containers[${container_index}].image = \"${CONTAINER_IMAGE}\"" "$manifest_path"

### Finalize
graceful_exit
