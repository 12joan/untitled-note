class UserMailer < Devise::Mailer
  default from: ENV.fetch('SMTP_FROM', 'hello@example.com')

  def headers_for(action, opts)
    super.merge!(template_path: 'users/mailer')
  end
end
