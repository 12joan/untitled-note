class AddRemoteVersionToDocument < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :remote_version, :integer, default: 1, null: false
  end
end
