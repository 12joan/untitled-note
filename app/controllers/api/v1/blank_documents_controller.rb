module API
  module V1
    class BlankDocumentsController < ApplicationController
      before_action :set_project

      def create
        @document = @project.documents.find_or_create_by(blank: true)
        render json: @document.query(:all)
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end
    end
  end
end
