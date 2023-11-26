class AddIdToDocumentsS3Files < ActiveRecord::Migration[7.0]
  def change
    add_column :documents_s3_files, :id, :primary_key
  end
end
