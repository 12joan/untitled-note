FactoryBot.define do
  factory :project do
    name { 'My project' }
  end

  factory :document do
    project
  end

  factory :alias do
    document
    text { 'An alias' }
  end

  factory :keyword do
    project
    sequence(:text) { |n| "Keyword #{n}" }
  end
end
