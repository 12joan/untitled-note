module Listenable
  extend ActiveSupport::Concern

  included do
    # The list of broadcastings needs to be computed before the transaction is
    # committed. Otherwise, code like `snapshot.document.owner` will fail
    # because the document has already been deleted.
    after_save :_listenable_set_broadcastings
    after_destroy :_listenable_set_broadcastings
    after_rollback :_listenable_unset_broadcastings

    # The broadcastings themselves must be performed after commit, since they
    # need to fetch the latest data from the database.
    after_commit do
      if @_listenable_broadcastings
        @_listenable_broadcastings.each do |broadcasting|
          ActionCable.server.broadcast broadcasting, :after_commit
        end
        _listenable_unset_broadcastings
      end
    end
  end

  private

  def _listenable_set_broadcastings
    @_listenable_broadcastings =
      Rails.application.config.data_streaming_config.broadcastings_for_record(self)
  end

  def _listenable_unset_broadcastings
    @_listenable_broadcastings = nil
  end
end
