FactoryBot.define do
  factory :user, aliases: [:owner] do
    name { 'Jane Doe' }
    auth0_id { '123456789' }
    storage_used { 100 * 50 }
  end

  factory :project, aliases: [:original_project] do
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
    owner
    original_project
    role { 'project-icon' }
    sequence(:s3_key) { |n| "uploads/#{n}.png" }
    sequence(:filename) { |n| "#{n}.png" }
    size { 100 }
    content_type { 'image/png' }
  end

  factory :settings do
    user
    data { { hello: 'world' }.to_json }
  end
end
