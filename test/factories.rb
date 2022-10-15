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

  factory :tag do
    project
    sequence(:text) { |n| "Tag #{n}" }
  end

  factory :s3_file do
    project
    role { 'project-icon' }
    sequence(:s3_key) { |n| "uploads/#{n}.png" }
    sequence(:filename) { |n| "#{n}.png" }
    size { 1234 }
    content_type { 'image/png' }
  end
end
