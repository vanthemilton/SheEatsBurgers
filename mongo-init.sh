#!/usr/bin/env bash

#USAGE
# mongo-init.sh -d <dir_with_models_to_backup> -s <server_files_location>


_V=2
function main() {

log "HELLO THEERE"
#move after default
input_parse "$@"

#SET SOME MONGO STUFF
_MONGO_HOST=localhost
_MONGO_PORT=27017
_MONGO_DB=sheeatsburgers
_MONGO_COLLECTION=sheeatsburgers
_MONGO_USER=sheeatsburgers
_MONGO_PASS=sheeatsburgers
_MONGO_INIT_DATA=/Users/dudeman/Documents/CS290/final/data.json

#teset is ioen
mongoimport --db $_MONGO_DB --collection $_MONGO_COLLECTION  --drop --file $_MONGO_INIT_DATA

#test us ruynngi


log "ALL DONE"


}
function log () {
if [[ $_V -ge 0 ]]; then
  echo " [ERROR] ${BASH_SOURCE}:${FUNCNAME[1]}: $@" >&2
fi
}

function logv () {
if [[ $_V -ge 1 ]]; then
  echo " [WARNING] ${BASH_SOURCE}:${FUNCNAME[1]}: $@" >&2
fi
}
function logvv () {
if [[ $_V -ge 2 ]]; then
  echo " [INFO] ${BASH_SOURCE}:${FUNCNAME[1]}: $@" >&2
fi
}

function input_parse() {
#default arguments
EXECDIR=$(pwd)
MODEL_DIRECTORY=$(pwd)
TAR_DIRECTORY=$(pwd)
ERROR=-1
while [[ $# > 0 ]]
do
  key="$1"

  case $key in
    -o|--output)
      TAR_DIRECTORY="$2"
      shift # past argument
      ;;
    -m|--model-directory)
      MODEL_DIRECTORY="$2"
      shift # past argument
      ;;
-p|--prefix)
MODEL_PREFIX="$2"
shift # past argument
;;
    -v|--verbose)
      _V=1
      shift # past argument
      ;;  
    -vv)
      _V=2
      shift # past argument
      ;; 
    -vvv)
      _V=3
      shift # past argument
      ;; 
    --default)
      DEFAULT=YES
      ;;
    *)
      # unknown option
      ;;
  esac
  shift # past argument or value
done
unset key
}

main "$@"
#end

