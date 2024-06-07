# Self-hosting guide

Untitled Note App is designed to be self-hosted using Docker. Follow these instructions to run your own instance.

## Prerequisites

You will need:

- An environment suitable for running Docker containers
- Credentials for an SMTP server
- Credentials for an S3 bucket (or an S3-compatible service such as MinIO)
- A reverse proxy capable of forwarding WebSocket traffic
- A domain name and SSL certificate
- Knowledge of Docker Compose

## Docker Compose

Create a `docker-compose.yml` file using the following config as a starting point. If you're using MinIO, you can add it as an additional container here.

```
version: '3'

x-healthcheck: &healthcheck
  interval: 1s
  retries: 40

services:
  # The main Rails application
  web:
    build: ./path/to/source/code
    env_file: .env
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      typesense:
        condition: service_healthy
    healthcheck:
      <<: *healthcheck
      test: 'timeout 1 bash -c "</dev/tcp/127.0.0.1/3000"'

  # Schedule recurring jobs. Uses the same Docker image as web.
  clockwork:
    build: ./path/to/source/code
    entrypoint: ''
    command: 'clockwork config/clockwork.rb'
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  # Database
  db:
    image: postgres
    environment:
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      <<: *healthcheck
      test: '/usr/bin/pg_isready -U postgres'

  # Used for handing WebSocket connections
  redis:
    image: redis
    healthcheck:
      <<: *healthcheck
      test: 'redis-cli --raw incr ping'

  # Search provider
  typesense:
    image: typesense/typesense:0.25.2
    command: '--data-dir /data --api-key=trust'
    volumes:
      - typesense:/data
    healthcheck:
      <<: *healthcheck
      test: 'timeout 1 bash -c "</dev/tcp/127.0.0.1/8108"'

volumes:
  pgdata:
  typesense:
```

In the same directory, create a `.env` file containing your environment variables.

```
# Application
RAILS_ENV="production"
# DEFAULT_STORAGE_QUOTA="" # Optional (defaults to 10485760 bytes)

# Services
DATABASE_URL="postgres://postgres@db"
REDIS_URL="redis://redis:6379"
TYPESENSE_URL="http://typesense:8108"
TYPESENSE_API_KEY="trust"

# File storage
# S3_ENDPOINT="https://minio.example.com/" # Optional (defaults to AWS)
S3_BUCKET="untitled-note-app" # This will be created automatically
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

# Email
SMTP_FROM="hello@example.com"
SMTP_ADDRESS="smtp.example.com"
SMTP_USERNAME=""
SMTP_PASSWORD=""
# SMTP_PORT="" # Optional (defaults to 25)
# SMTP_DOAMIN="" # Optional
# SMTP_AUTHENTICATION="" # Optional
# SMTP_ENABLE_STARTTLS_AUTO="" # Optional (defaults to true)
# SMTP_OPENSSL_VERIFY_MODE="" # Optional
# SMTP_SSL="" # Optional (defaults to true)
```

You should now be ready to start the application.

```
$ docker compose up -d
```

If all goes well, the application should be available at http://0.0.0.0:3000/. If something went wrong, check the logs using `docker compose logs -f` or start the server again without the `-d` flag. `docker compose ps` may also be useful to tell you which (if any) containers failed to start.

## Create an admin user (optional)

If you want to manage user accounts using the web interface, you'll need to create an admin user.

To create a new admin user:

```
$ docker compose exec web rails c
irb(main):001:0> User.create(email: 'admin@example.com', password: 'my-password', admin: true)
```

To convert an existing user to an admin:

```
$ docker compose exec web rails c
irb(main):001:0> User.find_by(email: 'admin@example.com).update(admin: true)
```

After signing in as the admin user, you will be able to access the user management page at http://0.0.0.0:3000/admin/users.

## Reverse proxy

Untitled Note App must be served over HTTPS. The simplest way of doing this with a reverse proxy. Ensure that requests to `/cable` are forwarded in a way that does not break WebSockets.

If you're using nginx, your `server` config might look something like this:

```
server {
  listen 443 ssl;
  server_name example.com;
  include /etc/nginx/ssl.conf;
  include /etc/nginx/common.conf;
  
  location /cable {
    proxy_pass                          http://127.0.0.1:3000;
    proxy_set_header  Host              $http_host;
    proxy_set_header  X-Real-IP         $remote_addr;
    proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto https;
    proxy_set_header  Upgrade           $http_upgrade;
    proxy_set_header  Connection        "Upgrade";
    proxy_http_version                  1.1;
    proxy_redirect                      off;
  }

  location / {
    proxy_pass                          http://127.0.0.1:3000;
    proxy_set_header  Host              $http_host;
    proxy_set_header  X-Real-IP         $remote_addr;
    proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto $scheme;
    proxy_read_timeout                  900;
  }
}
```
