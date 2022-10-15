class User < ApplicationRecord
  has_many :login_sessions, dependent: :destroy
  has_many :projects, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :s3_files, through: :projects
end
