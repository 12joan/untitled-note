#!/bin/sh
set -e

export TZ="Europe/London"

rm -f /app/tmp/pids/server.pid

bundle exec rails db:prepare

if [ "$RAILS_ENV" != "production" ]; then
  yarn install
  yarn build
  RAILS_ENV=test bundle exec rails db:prepare
fi

exec "$@"
