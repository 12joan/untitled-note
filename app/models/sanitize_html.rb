class DocumentBodyScrubber < Rails::Html::PermitScrubber
  def initialize
    super
    self.tags = %w(p br strong em del a h1 blockquote pre ul ol li x-definitive-mention)
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
  sanitized_html = Rails::Html::SafeListSanitizer.new.sanitize(html, scrubber: DocumentBodyScrubber.new)

  # Remove newlines from all elements except direct children of <pre>
  Nokogiri::HTML.fragment(sanitized_html).tap do |root|
    root.traverse do |node|
      if node.text? && /\n/.match?(node.text) && node.parent.node_name != 'pre'
        node.content = ''
      end
    end
  end.to_html
end
