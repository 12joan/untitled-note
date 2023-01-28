module API
  module V1
    class ProjectImagesController < APIController
      before_action :set_project

      def update
        Project.transaction do
          old_image = @project.image
          assign_new_image_if_present
          old_image&.destroy!
        end

        render json: { ok: true }
      end

      private

      def assign_new_image_if_present
        image_id = params[:image_id]
        new_image = image_id.present? ? current_user.s3_files.find(image_id) : nil
        @project.update!(image: new_image)
      end
    end
  end
end
