module Orderable
  def self.with(siblings:, uniqueness_scope:)
    Module.new do
      extend ActiveSupport::Concern

      included do
        validates :order_string,
          presence: true,
          uniqueness: { scope: uniqueness_scope },
          format: { with: /\A[a-f0-9]*[a-f1-9]\z/ }

        before_validation do
          move_to_end if self.order_string.nil?
        end
      end

      define_method :move_to_end do
        self.order_string = get_next_order_string
      end

      define_method :get_next_order_string do
        max_order_string = siblings.call(self).maximum(:order_string)
        return '8' if max_order_string.nil?

        last_char = max_order_string[-1]
        except_last_char = max_order_string[0..-2]

        if last_char == 'f'
          max_order_string + '1'
        else
          except_last_char + (last_char.to_i(16) + 1).to_s(16)
        end
      end
    end
  end
end
