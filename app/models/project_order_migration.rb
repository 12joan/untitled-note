# We need to convert a numerically ordered sequence of integers into an
# alphabetically ordered sequence of hex strings. To make this work for
# integers greater than 15 (0 is not permissible), we prepend an 'f' to the hex
# string every time the lowest digit is 'f'.

module ProjectOrderMigration
  def self.hex_for_int_order(int_order)
    prepended_f_count = int_order / 15
    hex_digit = (int_order % 15) + 1
    'f' * prepended_f_count + hex_digit.to_s(16)
  end
end
