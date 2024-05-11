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

      def batch_update
        Project.transaction do
          batch_project_params.each do |p|
            id = p.delete(:id) # Returns the deleted value
            project = current_user.projects.find(id)

            unless project.update(p)
              render json: project.errors, status: :unprocessable_entity
              raise ActiveRecord::Rollback
            end
          end

          head 200
        end
      end

      def destroy
        @project.destroy
        head :no_content
      end

      private

      # Only allow a list of trusted parameters through.
      def allowed_project_params
        %i[name emoji background_colour archived_at editor_style auto_snapshots_option list_index]
      end

      def project_params
        params.require(:project).permit(*allowed_project_params)
      end

      def batch_project_params
        params.require(:projects).map do |p|
          p.permit(:id, *allowed_project_params)
        end
      end
    end
  end
end
