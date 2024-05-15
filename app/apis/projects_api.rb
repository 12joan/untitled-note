class ProjectsAPI < ApplicationAPI
  def index
    @user.reload
    @user.projects.map do |project|
      project.query(params[:query])
    end
  end
end
