module API
  module V1
    class ProjectReplaceController < APIController
      before_action :set_project

      def create
        # TODO: Optimise using plain_body
        @project.documents.each do |document|
          ReplaceInDocument.perform(
            document: document,
            find: params.fetch(:find),
            replace: params.fetch(:replace),
          )
        end

        head :ok
      end
    end
  end
end
