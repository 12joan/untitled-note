class DecoupleS3FilesFromProjects < ActiveRecord::Migration[7.0]
  def up
    rename_column :s3_files, :project_id, :original_project_id

    add_reference :s3_files, :owner, null: true, foreign_key: { to_table: :users }

    S3File.find_each do |s3_file|
      connection = ActiveRecord::Base.connection

      project_rows = connection.execute(
        %Q{
          SELECT owner_id
          FROM projects
          WHERE id = #{connection.quote(s3_file.original_project_id)}
        }
      )

      raise 'Something went wrong' unless project_rows.count == 1

      owner_id = project_rows.first['owner_id']
      s3_file.update!(owner_id: owner_id)
    end

    change_column_null :s3_files, :owner_id, false
  end

  def down
    remove_reference :s3_files, :owner, foreign_key: { to_table: :users }
    rename_column :s3_files, :original_project_id, :project_id
  end
end
