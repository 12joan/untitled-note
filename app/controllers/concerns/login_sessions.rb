module LoginSessions
  extend ActiveSupport::Concern

  private 

  def create_login_session(user)
    login_session = LoginSession.create!(
      user: user,
      user_agent: request.user_agent || 'Unknown user agent',
    )

    cookies[:login_session_token] = {
      value: login_session.token,
      expires: 1.year.from_now,
      secure: request.ssl?,
      httponly: true,
      same_site: :lax, # :strict breaks Auth0 login flow
    }
  end

  def destroy_login_session
    cookies.delete(:login_session_token)
    current_login_session&.destroy!
  end

  def logged_in?
    current_login_session.present?
  end

  def current_login_session
    @current_login_session ||= LoginSession.find_by(token: cookies[:login_session_token])
  end

  def current_user
    current_login_session&.user
  end
end
