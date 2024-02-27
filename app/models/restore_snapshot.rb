class RestoreSnapshot
  def self.perform(snapshot:, save_current:)
    snapshot.transaction do
      document = snapshot.document

      if save_current
        document.snapshots.create!(
          body: document.body,
          before_restore_snapshot: snapshot,
        )
      end

      document.was_updated_on_server
      document.body = snapshot.body
      document.save!
    end
  end
end
