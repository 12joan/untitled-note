module API
  module V1
    class BlankDocumentsController < APIController
      before_action :set_project

      def create
        tags =
          if params[:tag_id].present?
            [@project.tags.find(params[:tag_id])]
          else
            []
          end

        @document = @project.documents.create(blank: true, tags: tags)
        render json: @document.query(:all)
      end
    end
  end
end
