class RedisStub
  def get(*args)
    Rails.logger.info "Stubbing redis.get(#{args.join(', ')})"
    nil
  end

  def set(*args)
    Rails.logger.info "Stubbing redis.set(#{args.join(', ')})"
    'OK'
  end
end

Rails.application.config.redis =
  if !Rails.env.test? && ENV.key?('REDIS_URL')
    ConnectionPool::Wrapper.new { Redis.new(url: ENV['REDIS_URL']) }
  else
    RedisStub.new
  end
