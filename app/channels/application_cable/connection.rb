module ApplicationCable
  class Connection < ActionCable::Connection::Base
    include Devise::Controllers::Helpers
    identified_by :user

    def connect
      reject_unauthorized_connection unless user_signed_in?
      self.user = current_user
    end
  end
end
