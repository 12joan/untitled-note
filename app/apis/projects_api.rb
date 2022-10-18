class ProjectsAPI < ApplicationAPI
  def index
    @user.projects.order(:list_index).map do |project|
      project.query(params[:query])
    end
  end
end
