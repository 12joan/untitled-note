class DocumentsTag < ApplicationRecord
  belongs_to :document
  belongs_to :tag

  include Listenable

  after_destroy do |documents_tag|
    if documents_tag.tag.documents_count.zero?
      tag.destroy
    end
  end
end
