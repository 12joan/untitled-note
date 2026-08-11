FROM node:24.19.0-alpine AS node
FROM ruby:4.0.5-alpine AS builder
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin
RUN apk add --update --no-cache bash build-base tzdata postgresql-dev yarn curl gcompat yaml yaml-dev libffi-dev
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable
COPY . .
RUN bin/precompile.sh

FROM ruby:4.0.5-alpine
RUN apk add --update --no-cache build-base tzdata postgresql-dev curl gcompat yaml yaml-dev libffi-dev
WORKDIR /app
COPY . .
RUN bundle config --global frozen 1
RUN bundle config --global without 'development test'
RUN bundle install
COPY --from=builder /app/public/vite public/vite
COPY --from=builder /app/public/assets public/assets

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

HEALTHCHECK --start-period=30s --start-interval=1s \
  CMD test -n "$SKIP_HEALTHCHECK" || curl -f http://localhost:3000/healthcheck || exit 1
