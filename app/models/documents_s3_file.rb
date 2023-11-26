class DocumentsS3File < ApplicationRecord
  belongs_to :document
  belongs_to :s3_file

  after_commit :update_s3_file_unused

  def update_s3_file_unused
    s3_file.update_unused unless s3_file.destroyed?
  end
end
