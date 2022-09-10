#!/bin/bash
set -e

export TZ="Europe/London"

rm -f /app/tmp/pids/server.pid

bundle exec rails db:prepare

exec "$@"
