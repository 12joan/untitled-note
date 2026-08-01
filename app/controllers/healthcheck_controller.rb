class HealthcheckController < ApplicationController
  def healthcheck
    render plain: 'OK'
  end
end
