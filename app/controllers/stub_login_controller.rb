class StubLoginController < ApplicationController
  def create
    raise 'Only available in test environment' unless Rails.env.test?
    session[:user_id] = params[:user_id]
    head :no_content
  end
end
