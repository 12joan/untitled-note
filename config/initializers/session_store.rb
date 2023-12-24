Rails.application.config.session_store(
  :cookie_store,
  key: '_session_token',
  secure: Rails.env.production?,
  same_site: :lax, # :strict breaks Auth0 login flow
)
