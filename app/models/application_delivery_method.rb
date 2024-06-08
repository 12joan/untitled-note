class ApplicationDeliveryMethod < Mail::SMTP
  SMTP_ENABLED = ENV.has_key?('SMTP_FROM')

  def deliver!(mail)
    to = mail.header[:to].to_s
    subject = mail.header[:subject].to_s
    body = mail.body.raw_source

    if !Rails.env.production? && (!SMTP_ENABLED || to.end_with?('@preview.local'))
      EmailPreview.create!(to: to, subject: subject, body: body)
    else
      super(mail)
    end
  end
end
