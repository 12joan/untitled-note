module ExtractPlainBody
  def self.perform(json_body, project:)
    plain_body = ''

    SlateUtils::SlateNode.parse(json_body).traverse do |node|
      if node.text?
        plain_body << node.text
      end

      if node.block_element?
        plain_body << ' '
      end

      if node.type == 'mention'
        document = project.documents.find_by(id: node.attributes[:documentId])
        if document
          plain_body << document.safe_title
        else
          plain_body << "[Deleted document: #{node.attributes[:fallbackText]}]"
        end
      end
    end

    plain_body.strip.gsub(/\s+/, ' ')
  end
end
