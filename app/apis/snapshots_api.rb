class SnapshotsAPI < ApplicationAPI
  def index
    set_document

    @document.snapshots.order(created_at: :asc).map do |snapshot|
      snapshot.query(:all)
    end
  end
end
