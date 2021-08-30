module API
  module V1
    class DocumentsController < ApplicationController
      include DocumentsQueryable

      before_action :set_project
      before_action :set_document, only: %i[ show edit update destroy ]

      def index
        @documents = query_documents(@project.documents, params)
      end

      def show
      end

      def create
        @document = @project.documents.build(document_params)

        unless keywords_attributes.nil?
          @document.keywords_attributes = keywords_attributes
        end

        if @document.save
          render :show, status: :created, location: api_v1_project_document_url(@project, @document)
        else
          puts @document.errors.inspect
          render json: @document.errors, status: :unprocessable_entity
        end
      end

      def update
        @document.assign_attributes(document_params)

        unless keywords_attributes.nil?
          @document.keywords_attributes = keywords_attributes
        end

        if @document.save
          render :show, status: :created, location: api_v1_project_document_url(@project, @document)
        else
          render json: @document.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @document.destroy
        head :no_content
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end

      def set_document
        @document = @project.documents.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def document_params
        params.require(:document).permit(:title, :body, :blank, :pinned_at)
      end

      def keywords_attributes
        params.require(:document).permit(keywords_attributes: [:text]).fetch(:keywords_attributes, nil)
      end
    end
  end
end
