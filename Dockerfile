FROM node:23.8.0-alpine AS node
FROM ruby:3.3.7-alpine

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN apk add --update --no-cache bash build-base tzdata postgresql-dev yarn curl gcompat yaml yaml-dev

WORKDIR /app

COPY Gemfile /app/
COPY Gemfile.lock /app/
RUN bundle install

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

COPY . .

RUN bin/precompile.sh

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000
EXPOSE 3100

EXPOSE 3035

CMD ["yarn", "start"]
