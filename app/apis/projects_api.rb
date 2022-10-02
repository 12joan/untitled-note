class ProjectsAPI < ApplicationAPI
  def index
    @user.projects.order(:created_at).map do |project|
      project.query(params[:query])
    end
  end
end
