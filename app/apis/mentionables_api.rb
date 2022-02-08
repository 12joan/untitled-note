class MentionablesAPI < ApplicationAPI
  def index
    set_project

    @project
      .documents
      .preload(:aliases)
      .map { |document| [document.id, document.mentionables] }
      .to_h
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
  end
end
