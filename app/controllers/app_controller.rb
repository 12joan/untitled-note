class AppController < ApplicationController
  include LoginSessions

  def index
    redirect_to welcome_path unless logged_in?
  end
end
