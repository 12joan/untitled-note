class KeywordsAPI < ApplicationAPI
  def index
    set_project

    @project.keywords.all.map do |keyword|
      keyword.query(params[:query])
    end
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end
end
