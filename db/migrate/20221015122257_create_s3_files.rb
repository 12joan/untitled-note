class CreateS3Files < ActiveRecord::Migration[7.0]
  def change
    create_table :s3_files do |t|
      t.references :project, null: false, foreign_key: true
      t.string :role
      t.string :s3_key
      t.string :filename
      t.integer :size
      t.string :content_type
      t.boolean :uploaded_cache, default: false, null: false

      t.timestamps
    end
  end
end
