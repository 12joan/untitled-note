SanitizeHtml = lambda do |html|
  Rails::Html::SafeListSanitizer.new.sanitize(
    html,
    tags: %w(p br strong em del a h1 blockquote pre ul ol li),
    attributes: %w(href),
  )
end
