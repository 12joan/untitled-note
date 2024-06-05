class StubLoginController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    raise 'Not available in production' if Rails.env.production?

    user = User.create!(
      email: Faker::Internet.email,
      password: 'password',
      confirmed_at: Time.now,
    )

    sign_in user

    head :no_content
  end
end
