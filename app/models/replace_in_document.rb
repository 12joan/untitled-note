class ReplaceInDocument
  def self.perform(document:, find:, replace:)
    raise ArgumentError, 'find cannot be blank' if find.blank?

    return 0 unless document.slate?

    document_root = SlateUtils::SlateNode.parse(document.body)

    replace_count = 0

    document_root.traverse do |node|
      if node.text?
        offset = 0

        while (index = node.text.downcase.index(find.downcase, offset))
          node.text[index, find.length] = replace
          offset = index + replace.length
          replace_count += 1
        end
      end
    end

    if replace_count > 0
      document.body = document_root.to_json
      document.plain_body.gsub!(find, replace)
      document.was_updated_on_server
      document.save!
    end

    replace_count
  end
end
