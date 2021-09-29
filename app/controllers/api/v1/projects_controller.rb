module API
  module V1
    class ProjectsController < ApplicationController
      before_action :set_project, only: %i[ update destroy ]

      def create
        @project = Project.new(project_params)

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

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def project_params
        params.require(:project).permit(:name)
      end
    end
  end
end
