# Self-hosting guide

Untitled Note App is designed to be self-hosted using Docker. Follow these instructions to run your own instance.

## Prerequisites

You will need:

- An environment suitable for running Docker containers
- Credentials for an SMTP server
- A reverse proxy capable of forwarding WebSocket traffic
- A domain name and SSL certificate
- Knowledge of Docker Compose

## Docker Compose

Create a `docker-compose.yml` file using the following config as a starting point.

```
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
      # If using MinIO:
      # minio:
      #   condition: service_healthy
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
      # If using MinIO:
      # minio:
      #   condition: service_healthy

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

  # Optional: Use MinIO for file storage
  # minio:
  #   image: minio/minio
  #   command: 'server /data'
  #   env_file: .env
  #   ports:
  #     - 9000:9000
  #   volumes:
  #     - minio:/data
  #   healthcheck:
  #     <<: *healthcheck
  #     test: 'timeout 1 bash -c "</dev/tcp/127.0.0.1/9000"'

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
  # If using MinIO:
  # minio:
```

## Environment variables

In the same directory, create a `.env` file containing your environment variables.

```
# Application
SECRET_KEY_BASE="" # See docs
MAILER_HOST="example.com"
RAILS_ENV="production"
RAILS_LOG_TO_STDOUT="true"
RAILS_SERVE_STATIC_FILES="true"
# DEFAULT_STORAGE_QUOTA="" # Optional (defaults to 10485760 bytes)
# DEMO_INSTANCE="true" # Optional (defaults to false)
# SIGN_UP_ENABLED="false" # Optional (defaults to true)

# Services
DATABASE_URL="postgres://postgres@db"
REDIS_URL="redis://redis:6379"
TYPESENSE_URL="http://typesense:8108"
TYPESENSE_API_KEY="trust"

# File storage (See docs)
# S3_BUCKET="untitled-note-app"
# S3_ENDPOINT="https://minio.example.com/" # Optional (defaults to AWS)
# AWS_REGION="" # Optional (defaults to us-east-1)
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""

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
# SMTP_SSL="" # Optional (defaults to false)
```

### Secret key

The `SECRET_KEY_BASE` environment variable is a 64-character hex string used by Rails to generate various encryption keys. Disclosing or using an insecure value for this key will allow attackers to sign in as other users by forging session cookies. You must use a unique key for each instance of the application.

Generate `SECRET_KEY_BASE` using a cryptographically secure random number generator such as `openssl`.

```
$ openssl rand -hex 64
```

### Mailer host

The `MAILER_HOST` environment variable specifies the host that will be used for links in emails. If the application is available at https://example.com/, you should set `MAILER_HOST` to `example.com`.

### SMTP

SMTP credentials are required for the application to send emails relating to user accounts. At minimum, you must provide `SMTP_FROM`, `SMTP_ADDRESS`, `SMTP_USERNAME` and `SMTP_PASSWORD`.

## File storage

To support file uploads, Untitled Note App needs access to an S3 bucket or an S3-compatible service such as MinIO.

Regardless of which method you use for this, the S3 bucket will be created automatically if it doesn't already exist. Do not enable public read or public write permissions on the S3 bucket.

### Method 1: Amazon S3

Sign up for Amazon Web Services, create an access key, and add the following environment variables to your `.env` file:

```
S3_BUCKET="untitled-note-app"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="****************"
AWS_SECRET_ACCESS_KEY="********************************"
```

### Method 2: Externally hosted S3-compatible service

Deploy some S3-compatible service such as MinIO separately from Untitled Note App and add the following environment variables to your `.env` file:

```
S3_BUCKET="untitled-note-app"
S3_ENDPOINT="https://minio.example.com/"
AWS_ACCESS_KEY_ID="****************"
AWS_SECRET_ACCESS_KEY="********************************"
```

The `S3_ENDPOINT` should be the publicly accessible URL of the S3 API. In the case of MinIO, the access key can be created using MinIO's web interface, or you can use the root username and password.

### Method 3: Add MinIO to Docker Compose

Uncomment the parts of `docker-compose.yml` relating to MinIO and add the following environment variables to your `.env` file, replacing the `build` path of `web` and `clockwork` with the path to the directory containing Untitled Note App's `Dockerfile`:

```
S3_BUCKET="untitled-note-app"
S3_ENDPOINT="http://minio:9000"
S3_EXTERNAL_ENDPOINT="https://minio.example.com/"
AWS_ACCESS_KEY_ID="root"
AWS_SECRET_ACCESS_KEY="********************************"

MINIO_ROOT_USER="root"
MINIO_ROOT_PASSWORD="********************************"
```

`AWS_SECRET_ACCESS_KEY` should be the same as `MINIO_ROOT_PASSWORD`, and should be generated using a cryptographically secure random number generator such as `openssl`. Anyone with the key will be able to perform arbitrary read and write operations on your MinIO server.

For this method, you will need to configure your reverse proxy to host MinIO's API (localhost:9000) on a separate domain or subdomain. `S3_EXTERNAL_ENDPOINT` should be the publicly accessible URL of your MinIO instance.

## Start the server

You should now be ready to start the application.

```
$ docker compose up -d
```

If all goes well, the application should be available at http://0.0.0.0:3000/. If something went wrong, check the logs using `docker compose logs -f` or start the server again without the `-d` flag. `docker compose ps` may also be useful to tell you which (if any) containers failed to start.

If you get an error when trying to submit a form and the message "Can't verify CSRF token authenticity" appears in the logs, this may be because you're accessing the application over HTTP rather than HTTPS. In production mode, the application's session cookie is configured to be secure, so it doesn't get sent when accessing the site insecurely. To fix this, see the instructions below to configure a reverse proxy.

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

# If using MinIO:
# server {
#   listen 443 ssl;
#   server_name minio.example.com;
#   include /etc/nginx/ssl.conf;
#   include /etc/nginx/common.conf;
#
#   # Optional: Allow large file uploads
#   # client_max_body_size 12000M;
#
#   location / {
#     proxy_pass                          http://127.0.0.1:9000;
#     proxy_set_header  Host              $http_host;   # required for docker client's sake
#     proxy_set_header  X-Real-IP         $remote_addr; # pass on real client's IP
#     proxy_set_header  X-Forwarded-For   $proxy_add_x_forwarded_for;
#     proxy_set_header  X-Forwarded-Proto $scheme;
#     proxy_read_timeout                  900;
#   }
# }
```
