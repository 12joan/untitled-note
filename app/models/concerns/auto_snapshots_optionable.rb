module AutoSnapshotsOptionable
  extend ActiveSupport::Concern

  included do
    enum :auto_snapshots_option, {
      disabled: 0,
      hourly: 1,
      daily: 2,
      weekly: 3,
      monthly: 4
    }
  end
end
