class DocumentsS3File < ApplicationRecord
  belongs_to :document
  belongs_to :s3_file

  after_commit :update_s3_file_unused

  def update_s3_file_unused
    if s3_file && !s3_file.destroyed?
      s3_file.update_unused
    end
  end
end
