class StubLoginController < ApplicationController
  include LoginSessions

  def create
    raise 'Only available in test environment' unless Rails.env.test?
    create_login_session(User.find(params[:user_id]))
    head :no_content
  end
end
