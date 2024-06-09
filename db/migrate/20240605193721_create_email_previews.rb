class CreateEmailPreviews < ActiveRecord::Migration[7.0]
  def change
    create_table :email_previews do |t|
      t.string :to, null: false
      t.string :subject, null: false
      t.text :body, null: false

      t.timestamps
    end
  end
end
