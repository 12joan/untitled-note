module API
  module V1
    class DocumentsController < ApplicationController
      before_action :set_project
      before_action :set_document, only: %i[ show update destroy ]

      def show
        render json: @document.query(:all)
      end

      def create
        @document = @project.documents.build(document_params)
        save_document
      end

      def update
        @document.assign_attributes(document_params)
        save_document
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

      def save_document
        unless document_params[:body].nil?
          @document.extract_definitive_mentions(document_params[:body])
        end

        unless keywords_attributes.nil?
          @document.keywords_attributes = keywords_attributes
        end

        if @document.save
          render json: @document.query(:all)
        else
          render json: @document.errors, status: :unprocessable_entity
        end
      end
    end
  end
end
