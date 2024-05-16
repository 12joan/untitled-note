class CreateProjectFolders < ActiveRecord::Migration[7.0]
  def up
    create_table :project_folders do |t|
      t.string :name, null: false
      t.string :order_string, null: false
      t.boolean :was_archived, null: false, default: false
      t.references :owner, null: false, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end

    add_reference :projects, :folder, foreign_key: { to_table: :project_folders }, index: true

    User.find_each do |user|
      archived_projects = user.projects.where.not(archived_at: nil)
      next if archived_projects.empty?

      folder = ProjectFolder.create!(name: 'Archived projects', owner: user, was_archived: true)
      archived_projects.update_all(folder_id: folder.id)
    end

    remove_column :projects, :archived_at
  end

  def down
    add_column :projects, :archived_at, :datetime

    ProjectFolder.find_each do |folder|
      folder.projects.update_all(archived_at: Time.current) if folder.was_archived?
    end

    remove_reference :projects, :folder, index: true
    drop_table :project_folders
  end
end
