module Queryable
  def self.permit(*queryable_attributes)
    Module.new do
      extend ActiveSupport::Concern

      define_method(:query) do |spec|
        if spec.to_s == 'all'
          spec = queryable_attributes.map { [_1, 'all'] }.to_h
        end

        {}.tap do |data|
          spec.each do |attr_name, attr_spec|
            raise "Invalid attribute #{attr_name}" unless queryable_attributes.include?(attr_name.to_sym)
            attr_value = send(attr_name.to_sym)

            data[attr_name] =
              if attr_value.respond_to?(:query)
                attr_value.query(attr_spec)
              elsif attr_value.is_a?(Array)
                attr_value.map { _1.query(attr_spec) }
              else
                attr_value
              end
          end
        end
      end
    end
  end
end
