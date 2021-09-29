class ProjectsAPI < ApplicationAPI
  def index
    Project.all.map do |project|
      project.query(params[:query])
    end
  end
end
