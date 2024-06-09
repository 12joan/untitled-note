class AppController < ApplicationController
  layout 'app'

  def index
    unless user_signed_in?
      if request.path == '/'
        redirect_to welcome_path
      else
        authenticate_user!
      end
    end
  end
end
