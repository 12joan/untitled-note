module API
  module V1
    class ProjectReplaceController < APIController
      before_action :set_project

      def create
        find = params.fetch(:find)
        replace = params.fetch(:replace)

        @project.documents.where('plain_body ~* ?', find).find_each do |document|
          ReplaceInDocument.perform(document: document, find: find, replace: replace)
        end

        head :ok
      end
    end
  end
end
