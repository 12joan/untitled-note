class APIController < ApplicationController
  include LoginSessions

  private

  def set_project
    project_id = block_given? ? yield : params.fetch(:project_id)
    @project = current_user.projects.find(project_id)
  end

  def set_project_folder
    project_folder_id = block_given? ? yield : params.fetch(:project_folder_id)
    @project_folder = current_user.project_folders.find(project_folder_id)
  end

  def set_document
    document_id = block_given? ? yield : params.fetch(:document_id)
    @document = @project.documents.find(document_id)
  end

  def set_snapshot
    snapshot_id = block_given? ? yield : params.fetch(:snapshot_id)
    @snapshot = @document.snapshots.find(snapshot_id)
  end
end
