class ReplaceInDocument
  def self.perform(document:, find:, replace:)
    raise ArgumentError, 'find cannot be blank' if find.blank?

    return 0 unless document.body_type.starts_with?('json/')

    document_root = JSON.parse(document.body)

    replace_count = 0

    new_document_root = document_root.map do |block|
      replace_in_node(block) do |text|
        text.tap do |replaced_text|
          offset = 0

          while (index = text.downcase.index(find.downcase, offset))
            replaced_text[index, find.length] = replace
            offset = index + replace.length
            replace_count += 1
          end
        end
      end
    end

    if replace_count > 0
      document.body = JSON.generate(new_document_root)
      document.was_updated_on_server
      document.save!
    end

    replace_count
  end

  private

  def self.replace_in_node(node, &block)
    if node.key?('text')
      node['text'] = yield(node['text'])
    end

    if node.key?('children')
      node['children'].map! do |child|
        replace_in_node(child, &block)
      end
    end

    node
  end
end
