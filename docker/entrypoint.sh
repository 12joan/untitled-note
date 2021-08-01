#!/bin/bash
set -e

export TZ="Europe/London"

rm -f /code/tmp/pids/server.pid

bundle exec rails db:prepare

if [ "$RAILS_ENV" = "development" ]; then
  bin/webpack-dev-server &
fi

exec "$@"
