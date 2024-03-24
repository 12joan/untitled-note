class Tag < ApplicationRecord
  include Listenable

  include Queryable.permit(
    *%i[
      id
      text
      project_id
      documents_count
      created_at
      updated_at
    ]
  )

  belongs_to :project
  has_many :documents_tags, dependent: :destroy
  has_many :documents_including_blank, through: :documents_tags, source: :document

  validates :text, presence: true, uniqueness: { scope: :project }

  def documents
    documents_including_blank.not_blank.order(:created_at)
  end

  def documents_count
    documents.count
  end

  def sequence_before_and_after(document)
    raise 'tag is not a sequence' unless sequence?
    index = document.blank? ? documents_count : documents.find_index(document)
    raise 'document is not in sequence' if index.nil?
    before = index.positive? ? documents[index - 1] : nil
    after = documents[index + 1]
    [before, after].map { |doc| doc&.query(id: true, safe_title: true) }
  end
end
