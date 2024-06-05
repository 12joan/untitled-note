class StubLoginController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    raise 'Not available in production' if Rails.env.production?

    user =
      if params[:user_id]
        User.find(params[:user_id])
      else
        User.create!(
          email: Faker::Internet.email,
          password: SecureRandom.hex,
          allow_stub_login: true,
        )
      end

    raise 'User does not allow stub login' unless user.allow_stub_login

    sign_in user

    head :no_content
  end
end
