module API
  module V1
    class S3FilesController < APIController
      before_action :set_project
      before_action :set_s3_file, only: %i[show destroy]

      def show
        render json: @s3_file.query(:all)
      end

      def create
        file_params = params.permit(:role, :filename, :size, :content_type)

        allowed, error = UploadAllowed.allowed?(user: current_user, file_params: file_params)

        if allowed
          s3_file = @project.s3_files.build(file_params.merge(
            s3_key: "uploads/#{current_user.id}/#{SecureRandom.uuid}",
          ))

          if s3_file.save
            render json: s3_file.query(:all).merge(
              presigned_post: s3_file.presigned_post,
            ), status: :created
          else
            render json: { error: s3_file.errors.full_messages.join(', ') }, status: :unprocessable_entity
          end
        else
          render json: { error: error }, status: :unprocessable_entity
        end
      end

      def destroy
        @s3_file.destroy
        head :no_content
      end

      private

      def set_s3_file
        @s3_file = @project.s3_files.find(params[:id])
      end
    end
  end
end