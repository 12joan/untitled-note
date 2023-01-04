module API
  module V1
    class TagsController < APIController
      before_action :set_project
      before_action :set_tag, only: %i[ update ]

      def update
        Tag.transaction do
          @tag.update!(tag_params)
          @tag.documents.each(&:was_updated_on_server!)
        end

        render json: @tag.query(:all)
      rescue ActiveRecord::RecordInvalid => e
        render json: e.record.errors, status: :unprocessable_entity
      end

      private

      def set_tag
        @tag = @project.tags.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def tag_params
        params.require(:tag).permit(:text)
      end
    end
  end
end
