class TagsAPI < ApplicationAPI
  def index
    set_project

    @project.tags.order(documents_count: :desc).all.map do |tag|
      tag.query(params[:query])
    end
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end
end
