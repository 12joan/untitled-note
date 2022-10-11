class Auth0Controller < ApplicationController
  include LoginSessions

  def callback
    auth_info = request.env['omniauth.auth']
    user_info = auth_info['extra']['raw_info']

    # Look up or create user by auth0_id
    user = User.find_or_create_by!(auth0_id: user_info['sub'])

    # Update user's name if changed
    user.update!(name: user_info['name']) if user.name != user_info['name']

    create_login_session(user)
    redirect_to app_url
  end

  def failure
    redirect_to welcome_url
    # TODO: Show error message
  end

  def logout
    destroy_login_session
    redirect_to logout_url, allow_other_host: true
  end

  private

  def logout_url
    URI::HTTPS.build(
      host: ENV.fetch('AUTH0_DOMAIN'),
      path: '/v2/logout',
      query: to_query(returnTo: app_url, client_id: ENV.fetch('AUTH0_CLIENT_ID')),
    ).to_s
  end

  def to_query(hash)
    hash.map { |k, v| "#{k}=#{CGI.escape(v)}" unless v.nil? }.reject(&:nil?).join('&')
  end
end
