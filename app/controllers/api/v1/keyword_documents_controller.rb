module API
  module V1
    class KeywordDocumentsController < ApplicationController
      include DocumentsQueryable

      before_action :set_project
      before_action :set_keyword
      before_action :set_requested_attributes, only: %i[ index show ]

      def index
        @documents = query_documents(@keyword.documents, params)

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
