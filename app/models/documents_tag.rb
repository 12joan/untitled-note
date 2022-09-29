class DocumentsTag < ApplicationRecord
  belongs_to :document
  belongs_to :tag, counter_cache: :documents_count

  include Listenable

  after_destroy do |documents_tag|
    if documents_tag.tag.documents.empty?
      tag.destroy
    end
  end
end
