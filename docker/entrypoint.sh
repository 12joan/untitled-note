#!/bin/bash
set -e

export TZ="Europe/London"

rm -f /app/tmp/pids/server.pid

if [ "$RAILS_ENV" != "production" ]; then
  yarn install
  yarn build
fi

bundle exec rails db:prepare

exec "$@"
