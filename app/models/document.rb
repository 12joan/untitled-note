class Document < ApplicationRecord
  belongs_to :project
  has_rich_text :body
  has_many :aliases, dependent: :destroy
  has_and_belongs_to_many :keywords
  accepts_nested_attributes_for :keywords

  after_initialize do |document|
    # Ensure document has a title (side effect of #title_record)
    raise 'Failed to create title for document' if title_record.nil?
  end

  after_save do |document|
    if @title_dirty
      title_record.save!
      @title_dirty = false
    end
  end

  def title
    title_record.text
  end

  def title=(value)
    title_record.text = value
    @title_dirty = true
  end

  def keywords_attributes=(keywords_attributes)
    keywords.clear

    keywords_attributes.uniq { _1[:text] }.each do |keyword_attributes|
      keyword = Keyword.find_or_initialize_by(
        project: project,
        text: keyword_attributes[:text]
      )

      if keyword.new_record?
        keywords.build(text: keyword.text, project: project)
      else
        keywords << keyword
      end
    end
  end

  private

  def title_record
    @title_record ||=
      aliases.filter(&:title?).first ||
      aliases.build(title: true, text: '')
  end
end
