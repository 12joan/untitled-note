module API
  module V1
    class DocumentReplaceController < APIController
      before_action :set_project
      before_action :set_document

      def create
        count = ReplaceInDocument.perform(
          document: @document,
          find: params.fetch(:find),
          replace: params.fetch(:replace),
        )

        render json: {
          occurrences: count,
        }
      end
    end
  end
end
