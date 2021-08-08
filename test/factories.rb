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
end
