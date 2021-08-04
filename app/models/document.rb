class Document < ApplicationRecord
  belongs_to :project
  has_rich_text :body
  has_many :aliases, dependent: :destroy

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

  private

  def title_record
    @title_record ||=
      aliases.filter(&:title?).first ||
      aliases.build(title: true, text: '')
  end
end
