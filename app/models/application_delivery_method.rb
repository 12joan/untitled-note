class ApplicationDeliveryMethod < Mail::SMTP
  def deliver!(mail)
    to = mail.header[:to].to_s
    subject = mail.header[:subject].to_s
    body = mail.body.raw_source

    if !Rails.env.production? && to.end_with?('@preview.local')
      EmailPreview.create!(to: to, subject: subject, body: body)
    else
      super(mail)
    end
  end
end
