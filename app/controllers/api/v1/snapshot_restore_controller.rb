module API
  module V1
    class SnapshotRestoreController < APIController
      before_action :set_project
      before_action :set_document
      before_action :set_snapshot

      def create
        RestoreSnapshot.perform(
          snapshot: @snapshot,
          save_current: params.fetch(:save_current)
        )

        head :no_content
      end
    end
  end
end
