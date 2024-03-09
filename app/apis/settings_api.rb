class SettingsAPI < ApplicationAPI
  def show
    @user.reload
    settings = @user.settings || @user.build_settings
    settings.query(:all)
  end
end
