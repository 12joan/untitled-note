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
          :archived_at,
          :editor_style,
          :auto_snapshots_option,
        )
      end
    end
  end
end
