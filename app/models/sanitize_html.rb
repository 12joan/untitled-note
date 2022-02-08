class DocumentBodyScrubber < Rails::Html::PermitScrubber
  def initialize
    super
    self.tags = %w(p br strong em del a h1 blockquote pre ul ol li)
    self.attributes = %w(href)
  end

  def allowed_node?(node)
    super || block_comment?(node)
  end

  def skip_node?(node)
    node.text?
  end

  private

  def block_comment?(node)
    node.to_html == '<!--block-->'
  end
end

SanitizeHtml = lambda do |html|
  Rails::Html::SafeListSanitizer.new.sanitize(html, scrubber: DocumentBodyScrubber.new)
    .gsub(/\n*(<\/?ul>|<\/ol>|<\/?li>)\n*/, '\1')
end
