class AddListIndexToProjects < ActiveRecord::Migration[7.0]
  def up
    add_column :projects, :list_index, :integer, null: true
    Project.find_each { |project| project.update_column(:list_index, project.id) }
  end

  def down
    remove_column :projects, :list_index
  end
end
