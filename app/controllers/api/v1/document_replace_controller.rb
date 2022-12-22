module API
  module V1
    class DocumentReplaceController < APIController
      before_action :set_project
      before_action :set_document

      def create
        ReplaceInDocument.perform(
          document: @document,
          find: params.fetch(:find),
          replace: params.fetch(:replace),
        )

        head :ok
      end
    end
  end
end
