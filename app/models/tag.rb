class Tag < ApplicationRecord
  belongs_to :project
  has_many :documents_tags, dependent: :destroy
  has_many :documents, through: :documents_tags

  validates :text, presence: true, uniqueness: { scope: :project }

  include Queryable.permit(*%i[id text project_id documents_count created_at updated_at])
  include Listenable

  def documents_count
    documents.not_blank.count
  end
end
