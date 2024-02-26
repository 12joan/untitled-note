module API
  module V1
    class SnapshotsController < APIController
      before_action :set_project
      before_action :set_document
      before_action :set_snapshot, only: %i[ update destroy ]

      def create
        @snapshot = @document.snapshots.build(snapshot_params)

        @snapshot.body = @document.body

        if @snapshot.save
          render json: @snapshot.query(:all)
        else
          render json: @snapshot.errors, status: :unprocessable_entity
        end
      end

      def update
        if @snapshot.update(snapshot_params)
          render json: @snapshot.query(:all)
        else
          render json: @snapshot.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @snapshot.destroy
        head :no_content
      end

      private

      def set_snapshot
        @snapshot = @document.snapshots.find(params[:id])
      end

      def snapshot_params
        params.require(:snapshot).permit(:name)
      end
    end
  end
end
