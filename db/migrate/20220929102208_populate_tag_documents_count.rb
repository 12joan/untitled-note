class PopulateTagDocumentsCount < ActiveRecord::Migration[6.1]
  def up
    Tag.find_each do |tag|
      Tag.reset_counters(tag.id, :documents)
    end
  end

  def down
    # Nothing to do
  end
end
