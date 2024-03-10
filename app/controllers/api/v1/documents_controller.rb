module API
  module V1
    class DocumentsController < APIController
      before_action :set_project

      before_action only: %i[ show update destroy ] do
        set_document { params.fetch(:id) }
      end

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

      # Only allow a list of trusted parameters through.
      def document_params
        params.require(:document).permit(
          :title,
          :body,
          :body_type,
          :blank,
          :editor_style,
          :auto_snapshots_option,
          :updated_by,
          :pinned_at,
          :locked_at,
        )
      end

      def tags_attributes
        params.require(:document).permit(tags_attributes: [:text]).fetch(:tags_attributes, nil)
      end

      def save_document
        unless tags_attributes.nil?
          @document.tags_attributes = tags_attributes
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
