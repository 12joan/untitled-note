module TryCreateAutoSnapshot
  def self.perform(document)
    auto_snapshots_option = document.resolved_auto_snapshots_option
    return if auto_snapshots_option == 'disabled'

    reference_date = document.snapshots.last&.created_at || document.created_at

    interval = {
      'hourly' => 1.hour,
      'daily' => 1.day,
      'weekly' => 1.week,
      'monthly' => 1.month,
    }[auto_snapshots_option]

    raise "Invalid auto_snapshots_option: #{auto_snapshots_option}" if interval.nil?

    if reference_date < interval.ago
      document.snapshots.create!(body: document.body, manual: false)
    end
  end
end
