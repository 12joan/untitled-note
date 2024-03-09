class Project < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :projects
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy
  belongs_to :image, class_name: 'S3File', optional: true
  has_many :s3_files, foreign_key: 'original_project_id', dependent: :nullify

  validates :name, presence: true
  validates :background_colour, inclusion: { in: %w[auto light dark] }
  validates :emoji, presence: true, allow_nil: true

  include EditorStylable
  include AutoSnapshotsOptionable

  include Queryable.permit(
    *%i[
      id
      name
      image_url
      emoji
      background_colour
      editor_style
      auto_snapshots_option
      created_at
      updated_at
      archived_at
    ]
  )

  include Listenable

  after_create do
    update!(list_index: id)
  end

  def image_url
    image&.url
  end

  def resolved_auto_snapshots_option
    auto_snapshots_option || owner.auto_snapshots_option
  end
end
