class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable

  has_many :projects, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :project_folders, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :documents, through: :projects
  has_many :s3_files, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_one :settings, dependent: :destroy

  def update_storage_used(difference)
    raise 'Storage used cannot be negative' if storage_used + difference < 0
    User.update_counters(id, storage_used: difference, touch: true)
  end

  def auto_snapshots_option
    settings&.auto_snapshots_option || 'disabled'
  end
end
