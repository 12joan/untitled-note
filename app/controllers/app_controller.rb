class AppController < ApplicationController
  def index
    redirect_to welcome_path unless helpers.logged_in?
  end
end
