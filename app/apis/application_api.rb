class ApplicationAPI
  attr_reader :params

  def initialize(params)
    @params = params
  end

  protected

  def validate_param(value, allowed_values:)
    allowed_values.map { [_1, _1] }.to_h.fetch(value)
  end
end
