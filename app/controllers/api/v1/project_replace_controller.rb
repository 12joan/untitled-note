module API
  module V1
    class ProjectReplaceController < APIController
      before_action :set_project

      def create
        find = params.fetch(:find)
        replace = params.fetch(:replace)

        occurrences = 0
        document_count = 0

        @project.documents.where('plain_body ~* ?', find).find_each do |document|
          count = ReplaceInDocument.perform(document: document, find: find, replace: replace)

          if count > 0
            occurrences += count
            document_count += 1
          end
        end

        render json: {
          occurrences: occurrences,
          documents: document_count,
        }
      end
    end
  end
end
