class Document < ApplicationRecord
  belongs_to :project
  has_rich_text :body
  has_many :aliases, dependent: :destroy
  has_many :documents_keywords, dependent: :destroy
  has_many :keywords, through: :documents_keywords
  accepts_nested_attributes_for :keywords

  scope :not_blank, -> { where(blank: false) }
  scope :pinned, -> { where.not(pinned_at: nil) }

  include Queryable.permit(*%i[id title safe_title blank created_at updated_at pinned_at body_content keywords])
  include Listenable

  def safe_title
    title.presence || 'Untitled document'
  end

  def body_content
    body.body.as_json
  end

  def keywords_attributes=(keywords_attributes)
    documents_keywords.each do |documents_keyword|
      if keywords_attributes.none? { |keyword_attributes| keyword_attributes[:text] == documents_keyword.keyword.text }
        documents_keyword.destroy
      end
    end

    keywords_attributes.uniq { _1[:text] }.each do |keyword_attributes|
      keyword = Keyword.find_or_initialize_by(
        project: project,
        text: keyword_attributes[:text]
      )

      if keyword.new_record?
        keywords.build(text: keyword.text, project: project)
      elsif keywords.find_by(text: keyword.text).nil?
        keywords << keyword
      end
    end
  end
end
