module API
  module V1
    class ProjectOrderController < APIController
      def update
        projects = current_user.projects

        Project.transaction do
          params[:order].each_with_index do |id, index|
            projects.find(id).update!(list_index: index + 1)
          end
        end

        render json: { ok: true }
      end
    end
  end
end
