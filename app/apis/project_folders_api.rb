class ProjectFoldersAPI < ApplicationAPI
  def index
    @user.reload
    @user.project_folders.map do |project_folder|
      project_folder.query(params[:query])
    end
  end
end
