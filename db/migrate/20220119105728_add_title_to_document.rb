# Prior to this migration, document titles were represented via associated
# Alias records with (title: true). This has proved troublesome for performing
# various operations on or involving document titles, such as reading,
# updating and sorting on the title.
#
# This migration simplifies the database schema by making title a column on
# the documents table, as it should have been from the start.

class AddTitleToDocument < ActiveRecord::Migration[6.1]
  def up
    add_column :documents, :title, :string

    Document.find_each do |document|
      title = document.aliases.find_by(title: true)&.text&.presence || ''
      document.update!(title: title)
      document.aliases.where(title: true).destroy_all
    end

    remove_column :aliases, :title
  end

  def down
    add_column :aliases, :title, :boolean

    Document.find_each do |document|
      document.aliases.create!(title: true, text: document.title)
    end

    remove_column :documents, :title
  end
end
