class APIController < ApplicationController
  include LoginSessions

  private

  def set_project
    project_id = block_given? ? yield : params.fetch(:project_id)
    @project = current_user.projects.find(project_id)
  end
end
