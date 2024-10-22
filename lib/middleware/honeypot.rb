module Middleware
  class Honeypot
    def initialize(app)
      @app = app
    end

    def call(env)
      request = Rack::Request.new(env)
      if request.params['robot_1'].present? || request.params['robot_2'].present?
        return [444, {}, []]
      end
      @app.call(env)
    end
  end
end
