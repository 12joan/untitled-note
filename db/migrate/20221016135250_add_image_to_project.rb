class AddImageToProject < ActiveRecord::Migration[7.0]
  def change
    add_reference :projects, :image, null: true, foreign_key: { to_table: :s3_files }
  end
end
