module ApplicationCable
  class Connection < ActionCable::Connection::Base
    include LoginSessions

    identified_by :user

    def connect
      reject_unauthorized_connection unless logged_in?
      self.user = current_user
    end
  end
end
