module API
  module V1
    class ProjectFoldersController < APIController
      before_action only: %i[ update destroy ] do
        set_project_folder { params[:id] }
      end

      def create
        @project_folder = current_user.project_folders.build(project_folder_params)

        if @project_folder.save
          render json: @project_folder.query(:all)
        else
          render json: @project_folder.errors, status: :unprocessable_entity
        end
      end

      def update
        if @project_folder.update(project_folder_params)
          render json: @project_folder.query(:all)
        else
          render json: @project_folder.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @project_folder.destroy
        head :no_content
      end

      private

      # Only allow a list of trusted parameters through.
      def project_folder_params
        params.require(:project_folder).permit(
          :name,
          :order_string,
        )
      end
    end
  end
end
