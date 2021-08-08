module API
  module V1
    class KeywordsController < ApplicationController
      before_action :set_project
      before_action :set_keyword, only: %i[ show edit update destroy ]

      def index
        @keywords = @project.keywords.all.order(:created_at)
      end

      def show
      end

      def create
        @keyword = @project.keywords.build(keyword_params)

        if @keyword.save
          render :show, status: :created, location: api_v1_project_keyword_url(@project, @keyword)
        else
          render json: @keyword.errors, status: :unprocessable_entity
        end
      end

      def update
        if @keyword.update(keyword_params)
          render :show, status: :created, location: api_v1_project_keyword_url(@project, @keyword)
        else
          render json: @keyword.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @keyword.destroy
        head :no_content
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end

      def set_keyword
        @keyword = @project.keywords.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def keyword_params
        params.require(:keyword).permit(:text)
      end
    end
  end
end
