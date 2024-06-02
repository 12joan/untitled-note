class WelcomeController < ApplicationController
  include LoginSessions
  layout 'static'

  def index
    @login_path = login_path
    @logged_in = logged_in?
  end
end
