class Document < ApplicationRecord
  belongs_to :project
  has_many :aliases, dependent: :destroy
  has_many :documents_keywords, dependent: :destroy
  has_many :keywords, through: :documents_keywords
  accepts_nested_attributes_for :keywords
  serialize :definitive_mentions, Array

  scope :not_blank, -> { where(blank: false) }
  scope :pinned, -> { where.not(pinned_at: nil) }

  include Queryable.permit(*%i[id title safe_title preview body body_type keywords blank remote_version created_at updated_at pinned_at])
  include Listenable

  # include Elasticsearch::Model
  # include Elasticsearch::Model::Callbacks
  # index_name "#{Rails.env}_documents"

  # def as_indexed_json(options = nil)
  #   self.as_json(only: %i[project_id title], methods: %i[plain_body])
  # end

  def safe_title
    title.presence || 'Untitled document'
  end

  def preview
    return 'This document has no content' if plain_body.blank?

    preview = ''

    plain_body.split(/\b/).each do |word|
      if preview.length + word.length <= 100
        preview += word
      else
        break
      end
    end

    (preview.presence || plain_body.slice(0, 100)).strip
  end

  def extract_definitive_mentions(body)
    self.definitive_mentions = Nokogiri::HTML.fragment(body).css('x-definitive-mention').map(&:text)
  end

  def mentionables
    ([title].compact + aliases.pluck(:text) + definitive_mentions)
      .flat_map { [_1, _1.pluralize] }.uniq
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
