module CleanUpBlankDocuments
  def self.perform
    User.find_each do |user|
      # Delete all blank documents created more than 24 hours ago except the
      # most recent one. Leaving the most recent blank document makes it less
      # likely that the user will return to a deleted blank document.
      user
        .documents
        .blank
        .where('documents.created_at < ?', 24.hours.ago)
        .order('documents.created_at DESC')
        .offset(1)
        .destroy_all
    end
  end
end
