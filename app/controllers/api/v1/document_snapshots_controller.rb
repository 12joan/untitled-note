module API
  module V1
    class DocumentSnapshotsController < APIController
      before_action :set_project
      before_action :set_document

      def create
        @snapshot = @document.snapshots.build(snapshot_params)

        @snapshot.body = @document.body

        if @snapshot.save
          render json: @snapshot.query(:all)
        else
          render json: @snapshot.errors, status: :unprocessable_entity
        end
      end

      def snapshot_params
        params.require(:snapshot).permit(:name)
      end
    end
  end
end
