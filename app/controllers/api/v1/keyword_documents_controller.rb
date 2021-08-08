module API
  module V1
    class KeywordDocumentsController < ApplicationController
      before_action :set_project
      before_action :set_keyword

      def index
        @documents = @keyword.documents.all.order(:created_at)

        render template: '/api/v1/documents/index'
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end

      def set_keyword
        @keyword = @project.keywords.find(params[:keyword_id])
      end
    end
  end
end
