class User < ApplicationRecord
  has_many :login_sessions, dependent: :destroy
  has_many :projects, foreign_key: :owner_id, dependent: :destroy
end
