class AddArchivedAtToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :archived_at, :datetime
  end
end
