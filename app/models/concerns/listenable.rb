module Listenable
  extend ActiveSupport::Concern

  included do
    after_commit do
      Rails.application.config.data_streaming_config.broadcastings_for_record(self).each do |broadcasting|
        ActionCable.server.broadcast broadcasting, :after_commit
      end
    end
  end
end
