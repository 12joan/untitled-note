class MakeS3FileOriginalProjectNullable < ActiveRecord::Migration[7.0]
  def change
    change_column_null :s3_files, :original_project_id, true
  end
end
