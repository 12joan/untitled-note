class Auth0Controller < ApplicationController
  include LoginSessions

  def callback
    auth_info = request.env['omniauth.auth']
    user_info = auth_info['extra']['raw_info']

    # Look up or create user by auth0_id
    user = User.find_or_create_by!(auth0_id: user_info['sub']) do |user|
      # Create an initial project if the user is newly created
      user.projects.build(name: 'My Project')
    end

    # Update user's name if changed
    user.update!(name: user_info['name']) if user.name != user_info['name']

    create_login_session(user)
    redirect_to request.env['omniauth.origin'] || app_path
  end

  def failure
    redirect_to welcome_url
    # TODO: Show error message
  end

  def logout
    destroy_login_session
    redirect_to logout_url, allow_other_host: true
  end

  def reset_password
    uri = URI::HTTPS.build(
      host: ENV.fetch('AUTH0_DOMAIN'),
      path: '/dbconnections/change_password',
    )

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request['content-type'] = 'application/json'

    request.body = {
      client_id: ENV.fetch('AUTH0_CLIENT_ID'),
      email: current_user.email,
      connection: 'Username-Password-Authentication',
    }.to_json

    response = http.request(request)

    if response.code == '200'
      render json: {}
    else
      render json: { error: response.body }, status: :internal_server_error
    end
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
