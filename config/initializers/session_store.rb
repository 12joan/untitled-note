allow_insecure_session_cookie =
  ENV.fetch('ALLOW_INSECURE_SESSION_COOKIE', 'false') == 'true'

Rails.application.config.session_store(
  :cookie_store,
  key: '_session_token',
  secure: Rails.env.production? && !allow_insecure_session_cookie,
  same_site: :strict,
)
