module API
  module V1
    class BlankDocumentsController < ApplicationController
      before_action :set_project

      def create
        @document = @project.documents.find_or_create_by(blank: true)
        render '/api/v1/documents/show', status: :created, location: api_v1_project_document_url(@project, @document)
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end
    end
  end
end
