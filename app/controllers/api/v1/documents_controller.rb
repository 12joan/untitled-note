module API
  module V1
    class DocumentsController < ApplicationController
      before_action :set_document, only: %i[ show edit update destroy ]

      def index
        @documents = Document.all.order(:created_at)
      end

      def show
      end

      def create
        @document = Document.new(document_params)

        if @document.save
          render :show, status: :created, location: api_v1_document_url(@document)
        else
          render json: @document.errors, status: :unprocessable_entity
        end
      end

      def update
        if @document.update(document_params)
          render :show, status: :ok, location: api_v1_document_url(@document)
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
      def set_document
        @document = Document.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def document_params
        params.require(:document).permit(:title, :body)
      end
    end
  end
end
