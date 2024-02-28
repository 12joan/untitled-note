class RestoreSnapshot
  def self.perform(snapshot:, save_current:)
    snapshot.transaction do
      document = snapshot.document

      if save_current
        document.snapshots.create!(
          body: document.body,
          manual: false,
        )
      end

      document.snapshots.create!(
        body: snapshot.body,
        restores_snapshot: snapshot.restores_snapshot_or_self,
      )

      document.was_updated_on_server
      document.body = snapshot.body
      document.save!
    end
  end
end
