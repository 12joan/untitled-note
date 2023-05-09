module API
  module V1
    class SettingsController < APIController
      before_action :set_settings

      def show
        render json: @settings&.data
      end

      def update
        @settings ||= current_user.build_settings

        if @settings.update(settings_params)
          head :no_content
        else
          render json: @settings.errors, status: :unprocessable_entity
        end
      end

      private

      def settings_params
        params.require(:settings).permit(:data)
      end

      def set_settings
        @settings = current_user.settings
      end
    end
  end
end
