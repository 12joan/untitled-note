class UserMailer < Devise::Mailer
  default from: ENV.fetch('SMTP_FROM')

  def headers_for(action, opts)
    super.merge!(template_path: 'users/mailer')
  end
end
