class User < ApplicationRecord
  has_many :projects, foreign_key: :owner_id, dependent: :destroy
end
