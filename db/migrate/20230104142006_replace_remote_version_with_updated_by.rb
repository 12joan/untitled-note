class ReplaceRemoteVersionWithUpdatedBy < ActiveRecord::Migration[7.0]
  def up
    remove_column :documents, :remote_version
    add_column :documents, :updated_by, :string, default: 'server', null: false
  end

  def down
    remove_column :documents, :updated_by
    add_column :documents, :remote_version, :integer, default: 1, null: false
  end
end
