module API
  module V1
    class SnapshotsController < APIController
      before_action :set_project
      before_action :set_document

      before_action only: %i[ update destroy ] do
        set_snapshot { params.fetch(:id) }
      end

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

      def snapshot_params
        params.require(:snapshot).permit(:name)
      end
    end
  end
end
