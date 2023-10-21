class StubLoginController < ApplicationController
  include LoginSessions
  skip_before_action :verify_authenticity_token

  def create
    raise 'Not available in production' if Rails.env.production?

    user =
      if params[:user_id]
        User.find(params[:user_id])
      else
        User.create!(name: 'Stub User', allow_stub_login: true)
      end

    raise 'User does not allow stub login' unless user.allow_stub_login

    create_login_session user

    head :no_content
  end
end
