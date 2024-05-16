module API
  module V1
    class ProjectsController < APIController
      before_action only: %i[ update destroy ] do
        set_project { params[:id] }
      end

      def create
        @project = current_user.projects.build(project_params)

        if @project.save
          render json: @project.query(:all)
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      def update
        if @project.update(project_params)
          render json: @project.query(:all)
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @project.destroy
        head :no_content
      end

      private

      # Only allow a list of trusted parameters through.
      def project_params
        params.require(:project).permit(
          :name,
          :emoji,
          :background_colour,
          :editor_style,
          :auto_snapshots_option,
          :order_string,
        ).tap do |p|
          # Distinguish between folder_id being nil and not being present
          if params[:project].has_key?(:folder_id)
            folder_id = params[:project][:folder_id]

            p[:folder] =
              if folder_id.nil?
                nil
              else
                current_user.project_folders.find(folder_id)
              end
          end
        end
      end
    end
  end
end
