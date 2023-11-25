class CreateJoinTableDocumentsS3Files < ActiveRecord::Migration[7.0]
  def up
    create_join_table :documents, :s3_files do |t|
      t.index [:document_id, :s3_file_id]
      t.index [:s3_file_id, :document_id]
    end

    Document.find_each do |document|
      document.update_linked_s3_files
    end
  end

  def down
    drop_join_table :documents, :s3_files
  end
end
