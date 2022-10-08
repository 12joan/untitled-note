class DataStreamingConfig
  def initialize(options)
    @options = options
  end

  def api_controller_for_model(model)
    api_for_model(model).fetch(:api_controller)
  end

  def allowed_actions_for_model(model)
    api_for_model(model).fetch(:actions).keys.to_set
  end

  def broadcasting_for_action(model, action, params, current_user)
    api_for_model(model).fetch(:actions).fetch(action).call(params.merge(user_id: current_user.id))
  end

  def broadcastings_for_record(record)
    listener_block = listener_for_model(record.class.name.demodulize.to_sym)

    ListenerDSL.new(self).tap do |dsl|
      dsl.instance_exec(record, &listener_block)
    end.broadcastings
  end

  private

  def api_for_model(model)
    @options.fetch(:apis).fetch(model)
  end

  def listener_for_model(model)
    @options.fetch(:listeners).fetch(model)
  end

  class ListenerDSL
    attr_reader :broadcastings

    def initialize(data_streaming_config)
      @data_streaming_config = data_streaming_config
      @broadcastings = Set.new
    end

    def broadcast(broadcasting)
      @broadcastings << broadcasting
    end

    def broadcast_for(record)
      @broadcastings += @data_streaming_config.broadcastings_for_record(record)
    end
  end
end
