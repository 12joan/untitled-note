FactoryBot.define do
  factory :document do
  end

  factory :alias do
    document
    text { 'An alias' }
  end
end
