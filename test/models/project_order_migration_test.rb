require 'test_helper'

class ProjectOrderMigrationTest < ActiveSupport::TestCase
  test 'returns a single hex digit for N < 15' do
    assert_equal '1', ProjectOrderMigration.hex_for_int_order(0)
    assert_equal '2', ProjectOrderMigration.hex_for_int_order(1)
    assert_equal '3', ProjectOrderMigration.hex_for_int_order(2)
    assert_equal '4', ProjectOrderMigration.hex_for_int_order(3)
    assert_equal '5', ProjectOrderMigration.hex_for_int_order(4)
    assert_equal '6', ProjectOrderMigration.hex_for_int_order(5)
    assert_equal '7', ProjectOrderMigration.hex_for_int_order(6)
    assert_equal '8', ProjectOrderMigration.hex_for_int_order(7)
    assert_equal '9', ProjectOrderMigration.hex_for_int_order(8)
    assert_equal 'a', ProjectOrderMigration.hex_for_int_order(9)
    assert_equal 'b', ProjectOrderMigration.hex_for_int_order(10)
    assert_equal 'c', ProjectOrderMigration.hex_for_int_order(11)
    assert_equal 'd', ProjectOrderMigration.hex_for_int_order(12)
    assert_equal 'e', ProjectOrderMigration.hex_for_int_order(13)
    assert_equal 'f', ProjectOrderMigration.hex_for_int_order(14)
  end

  test 'prepends an f for 15 <= N < 30' do
    assert_equal 'f1', ProjectOrderMigration.hex_for_int_order(15)
    assert_equal 'f2', ProjectOrderMigration.hex_for_int_order(16)
    assert_equal 'f3', ProjectOrderMigration.hex_for_int_order(17)
    assert_equal 'f4', ProjectOrderMigration.hex_for_int_order(18)
    assert_equal 'f5', ProjectOrderMigration.hex_for_int_order(19)
    assert_equal 'f6', ProjectOrderMigration.hex_for_int_order(20)
    assert_equal 'f7', ProjectOrderMigration.hex_for_int_order(21)
    assert_equal 'f8', ProjectOrderMigration.hex_for_int_order(22)
    assert_equal 'f9', ProjectOrderMigration.hex_for_int_order(23)
    assert_equal 'fa', ProjectOrderMigration.hex_for_int_order(24)
    assert_equal 'fb', ProjectOrderMigration.hex_for_int_order(25)
    assert_equal 'fc', ProjectOrderMigration.hex_for_int_order(26)
    assert_equal 'fd', ProjectOrderMigration.hex_for_int_order(27)
    assert_equal 'fe', ProjectOrderMigration.hex_for_int_order(28)
    assert_equal 'ff', ProjectOrderMigration.hex_for_int_order(29)
  end

  test 'keeps prepending f for N >= 30' do
    assert_equal 'ff1', ProjectOrderMigration.hex_for_int_order(30)
    assert_equal 'fff', ProjectOrderMigration.hex_for_int_order(44)
    assert_equal 'fff1', ProjectOrderMigration.hex_for_int_order(45)
    assert_equal 'ffff', ProjectOrderMigration.hex_for_int_order(59)
  end
end
