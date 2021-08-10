class DocumentsKeyword < ApplicationRecord
  belongs_to :document
  belongs_to :keyword

  after_destroy do |documents_keyword|
    if documents_keyword.keyword.documents.empty?
      keyword.destroy
    end
  end
end
