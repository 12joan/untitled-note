class APIController < ApplicationController
  private

  def current_user
    helpers.current_user
  end

  def set_project
    project_id = block_given? ? yield : params.fetch(:project_id)
    @project = current_user.projects.find(project_id)
  end
end
