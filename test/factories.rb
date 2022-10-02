FactoryBot.define do
  factory :user, aliases: [:owner] do
    name { 'Jane Doe' }
    auth0_id { '123456789' }
  end

  factory :project do
    owner
    name { 'My project' }
  end

  factory :document do
    project
  end

  factory :alias do
    document
    text { 'An alias' }
  end

  factory :tag do
    project
    sequence(:text) { |n| "Tag #{n}" }
  end
end
