module Queryable
  def self.permit(*queryable_attributes)
    Module.new do
      extend ActiveSupport::Concern

      define_method(:query) do |spec|
        if spec.to_s == 'all'
          spec = queryable_attributes.map { [_1, true] }.to_h
        end

        {}.tap do |data|
          spec.each do |attr_name, attr_spec|
            if queryable_attributes.include?(attr_name.to_sym)
              data[attr_name] = send(attr_name.to_sym)
            else
              raise "Invalid attribute #{attr_name}"
            end
          end
        end
      end
    end
  end
end
