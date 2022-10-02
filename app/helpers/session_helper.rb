module SessionHelper
  def logged_in?
    session[:user_id].present?
  end

  def current_user
    if logged_in?
      @current_user ||= User.find(session.fetch(:user_id))
    else
      raise 'Cannot get current user when not logged in'
    end
  end
end
