module API
  module V1
    class BlankDocumentsController < APIController
      before_action :set_project

      def create
        @document = @project.documents.find_or_create_by(blank: true)
        render json: @document.query(:all)
      end
    end
  end
end
