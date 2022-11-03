require './config/boot'
require './config/environment'

module Clockwork
  handler do |job|
    ActiveRecord::Base.connection_pool.with_connection do
      case job
      when 'clean_up_s3_files'
        CleanUpS3Files.perform
      end
    end
  end

  every(1.day, 'clean_up_s3_files', at: '00:00')
end
