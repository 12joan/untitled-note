class User < ApplicationRecord
  has_many :login_sessions, dependent: :destroy
  has_many :projects, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :s3_files, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner

  # Auth0 supplies the user's email address in the 'name' field. This may break
  # in the future if Auth0 changes this behaviour.
  def email
    name
  end

  def update_storage_used(difference)
    raise 'Storage used cannot be negative' if storage_used + difference < 0
    User.update_counters(id, storage_used: difference, touch: true)
  end
end
