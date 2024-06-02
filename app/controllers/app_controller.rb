class AppController < ApplicationController
  include LoginSessions
  layout 'app'

  def index
    unless logged_in?
      if request.path == '/'
        redirect_to welcome_path
      else
        @login_path = login_path(request.path)
        render 'unauthenticated'
      end
    end
  end
end
