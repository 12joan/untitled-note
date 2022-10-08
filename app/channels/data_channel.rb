class DataChannel < ApplicationCable::Channel
  def subscribed
    stream_from broadcasting_name do
      transmit_action_data
    end

    transmit_action_data
  end

  private

  def transmit_action_data
    raise "Unpermitted action: #{action}" unless action_allowed?
    api_controller = api_controller_for_model.new(user: current_user, params: action_params)
    transmit api_controller.send(action).to_json
  end

  def action_allowed?
    allowed_actions = data_streaming_config.allowed_actions_for_model(model)
    allowed_actions.include?(action)
  end

  def api_controller_for_model
    @api_controller_for_model ||= data_streaming_config.api_controller_for_model(model)
  end

  def broadcasting_name
    @broadcasting_name ||= data_streaming_config.broadcasting_for_action(model, action, action_params, current_user)
  end

  def current_user
    connection.user
  end

  def model
    @model ||= params[:model].to_sym
  end

  def action
    @action ||= params[:action].to_sym
  end

  def action_params
    @action_params ||= params[:params]
  end

  def data_streaming_config
    Rails.application.config.data_streaming_config
  end
end
