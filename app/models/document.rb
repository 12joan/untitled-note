class Document < ApplicationRecord
  belongs_to :project
  has_one :owner, through: :project

  has_many :documents_tags, dependent: :destroy
  has_many :tags, through: :documents_tags
  accepts_nested_attributes_for :tags

  has_many :documents_s3_files, dependent: :destroy
  has_many :s3_files, through: :documents_s3_files

  scope :blank, -> { where(blank: true) }
  scope :not_blank, -> { where(blank: false) }
  scope :pinned, -> { where.not(pinned_at: nil) }

  include Queryable.permit(*%i[id title safe_title preview body body_type tags blank updated_by created_at updated_at pinned_at locked_at])
  include Listenable

  after_create :update_linked_s3_files
  after_update :update_linked_s3_files

  after_commit :upsert_to_typesense, on: %i[create update]
  after_destroy :destroy_from_typesense

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

  def slate?
    body_type == 'json/slate'
  end

  def was_updated_on_server
    self.updated_by = 'server'
  end

  def was_updated_on_server!
    was_updated_on_server
    save!
  end

  def tags_attributes=(tags_attributes)
    documents_tags.each do |documents_tag|
      if tags_attributes.none? { |tag_attributes| tag_attributes[:text] == documents_tag.tag.text }
        documents_tag.destroy
      end
    end

    tags_attributes.uniq { _1[:text] }.each do |tag_attributes|
      tag = Tag.find_or_initialize_by(
        project: project,
        text: tag_attributes[:text]
      )

      if tag.new_record?
        tags.build(text: tag.text, project: project)
      elsif tags.find_by(text: tag.text).nil?
        tags << tag
      end
    end
  end

  def update_linked_s3_files
    return unless slate?

    s3_file_ids = []

    SlateUtils::SlateNode.parse(body).traverse do |node|
      if node.type == 'attachment'
        s3_file_ids << node.attributes[:s3FileId]
      end
    end

    self.s3_files = s3_file_ids.uniq.map do |s3_file_id|
      owner.s3_files.find_by(id: s3_file_id)
    end.compact
  end

  def upsert_to_typesense(collection: self.class.typesense_collection)
    collection.documents.upsert(
      id: id.to_s,
      project_id: project_id,
      title: title,
      safe_title: safe_title,
      plain_body: plain_body,
    )
  end

  def destroy_from_typesense(collection: self.class.typesense_collection)
    collection.documents.delete(filter_by: "id:#{id}")
  end

  def self.reindex_typesense_collection(collection: typesense_collection)
    find_each { |document| document.upsert_to_typesense(collection: collection) }
  end

  def self.search(project:, query:, collection: typesense_collection)
    collection.documents.search(
      q: query,
      query_by: 'title,plain_body',
      filter_by: "project_id:#{project.id}",
      highlight_start_tag: '<strong>',
      highlight_end_tag: '</strong>',
    ).fetch('hits')
  end

  def self.typesense_collection
    Rails.application.config.typesense_collections.documents
  end
end
