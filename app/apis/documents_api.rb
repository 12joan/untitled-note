class DocumentsAPI < ApplicationAPI
  def index
    set_project

    @project.documents.all.map do |document|
      document.query(params[:query])
    end
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end
end
