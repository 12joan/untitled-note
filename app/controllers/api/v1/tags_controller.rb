module API
  module V1
    class TagsController < APIController
      before_action :set_project
      before_action :set_tag, only: %i[ update ]

      def update
        if @tag.update(tag_params)
          @tag.documents.each(&:increment_remote_version!)

          render json: @tag.query(:all)
        else
          render json: @tag.errors, status: :unprocessable_entity
        end
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
