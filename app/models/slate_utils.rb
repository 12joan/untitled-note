module SlateUtils
  class SlateChildren < Array
    def to_json
      map(&:to_h).to_json
    end

    def self.from_a(array)
      new(array.map { |h| SlateNode.from_h(h) })
    end

    def traverse(&block)
      each do |node|
        node.traverse(&block)
      end
    end
  end

  class SlateNode
    SPECIAL_ATTRIBUTES = %i[type text children].freeze

    attr_accessor :type, :text, :children, :attributes, :parent

    def initialize(type: nil, text: nil, attributes: {}, children: nil)
      @type = type
      @text = text
      @attributes = attributes
      @children = children
    end

    def element?
      !@type.nil?
    end

    # In Slate, an inline children list must start with a text node
    def inline_element?
      element? && siblings&.first&.text?
    end

    def block_element?
      element? && !inline_element?
    end

    def text?
      !@text.nil?
    end

    def siblings
      parent&.children
    end

    def traverse(&block)
      yield self
      children&.traverse(&block)
    end

    def self.from_h(hash)
      new(
        type: hash[:type],
        text: hash[:text],
        attributes: hash.reject { |k, _| SPECIAL_ATTRIBUTES.include?(k) },
        children: hash[:children]&.then { |children| SlateChildren.from_a(children) }
      ).tap do |node|
        node.children&.each { |child| child.parent = node }
      end
    end

    def self.parse(json)
      parsed = JSON.parse(json, symbolize_names: true)

      if parsed.is_a?(Array)
        SlateChildren.from_a(parsed)
      else
        from_h(parsed)
      end
    end

    def to_h
      {}.tap do |h|
        h[:type] = type unless type.nil?
        h[:text] = text unless text.nil?
        h.merge!(attributes)
        h[:children] = children.map(&:to_h) unless children.nil?
      end
    end

    def to_json
      to_h.to_json
    end
  end
end
