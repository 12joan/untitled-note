class DocumentsS3File < ApplicationRecord
  belongs_to :document
  belongs_to :s3_file
end
