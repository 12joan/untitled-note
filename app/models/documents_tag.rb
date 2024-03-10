class DocumentsTag < ApplicationRecord
  include Listenable

  belongs_to :document
  belongs_to :tag

  after_destroy do |documents_tag|
    if documents_tag.tag.documents_count.zero?
      tag.destroy
    end
  end
end
