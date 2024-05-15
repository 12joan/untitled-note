class Project < ApplicationRecord
  include EditorStylable
  include AutoSnapshotsOptionable
  include Listenable

  include Queryable.permit(
    *%i[
      id
      name
      image_url
      emoji
      background_colour
      editor_style
      auto_snapshots_option
      order_string
      created_at
      updated_at
      archived_at
    ]
  )

  belongs_to :owner, class_name: 'User', inverse_of: :projects
  has_many :documents, dependent: :destroy
  has_many :tags, dependent: :destroy
  belongs_to :image, class_name: 'S3File', optional: true
  has_many :s3_files, foreign_key: 'original_project_id', dependent: :nullify

  validates :name, presence: true
  validates :background_colour, inclusion: { in: %w[auto light dark] }
  validates :emoji, presence: true, allow_nil: true
  validates :order_string, presence: true, uniqueness: { scope: :owner_id }, format: { with: /\A[a-f0-9]*[a-f1-9]\z/ }

  before_validation do
    self.order_string ||= get_next_order_string
  end

  def image_url
    image&.url
  end

  def resolved_auto_snapshots_option
    auto_snapshots_option || owner.auto_snapshots_option
  end

  private

  def get_next_order_string
    max_order_string = owner.projects.maximum(:order_string)
    return '8' if max_order_string.nil?

    last_char = max_order_string[-1]
    except_last_char = max_order_string[0..-2]

    if last_char == 'f'
      max_order_string + '1'
    else
      except_last_char + (last_char.to_i(16) + 1).to_s(16)
    end
  end
end
