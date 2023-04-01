FROM ruby:3.0.6-alpine

RUN apk add --update --no-cache bash build-base nodejs tzdata postgresql-dev yarn curl

WORKDIR /app

COPY Gemfile /app/
COPY Gemfile.lock /app/
RUN bundle install

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

COPY . .

RUN yarn build

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000
EXPOSE 3035

CMD ["yarn", "start"]
