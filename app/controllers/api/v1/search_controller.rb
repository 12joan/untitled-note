module API
  module V1
    class SearchController < APIController
      before_action :set_project

      def show
        render json: Document.search(project: @project, query: params.fetch(:q))
      end
    end
  end
end
