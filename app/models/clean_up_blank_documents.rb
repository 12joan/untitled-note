module CleanUpBlankDocuments
  def self.perform
    Document.blank.where('created_at < ?', 24.hours.ago).destroy_all
  end
end
