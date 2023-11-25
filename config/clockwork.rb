require './config/boot'
require './config/environment'

module Clockwork
  handler do |job|
    ActiveRecord::Base.connection_pool.with_connection do
      case job
      when 'nightly'
        isolate_errors { CleanUpUnuploadedS3Files.perform }
        isolate_errors { CleanUpUntrackedS3Objects.perform }
        isolate_errors { CleanUpBlankDocuments.perform }
      end
    end
  end

  every(1.day, 'nightly', at: '00:00')

  def self.isolate_errors
    yield
  rescue => e
    puts e.message
    puts e.backtrace
  end
end
