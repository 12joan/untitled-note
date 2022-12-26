class WelcomeController < ApplicationController
  include LoginSessions

  def index
    @login_path = login_path
  end
end
