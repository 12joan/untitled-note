module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :user

    def connect
      reject_unauthorized_connection unless logged_in?
      self.user = current_user
    end

    private

    include SessionHelper

    def session
      @request.session
    end
  end
end
