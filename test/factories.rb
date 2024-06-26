FactoryBot.define do
  factory :user, aliases: [:owner] do
    email { Faker::Internet.email }
    password { 'password' }
    confirmed_at { Time.now }
    storage_used { 100 * 50 }
  end

  factory :project, aliases: [:original_project] do
    owner
    name { 'My project' }
  end

  factory :project_folder do
    owner
    name { 'Favourite projects' }
  end

  factory :document do
    body_type { 'empty' }
    body { body_type == 'empty' ? '' : '[{"type":"paragraph","children":[{"text":""}]}]' }
    project
  end

  factory :snapshot do
    name { 'My snapshot' }
    body { '[{"type":"paragraph","children":[{"text":""}]}' }
    document { build(:document, body_type: 'json/slate') }
  end

  factory :tag do
    project
    sequence(:text) { |n| "Tag #{n}" }
  end

  factory :s3_file do
    owner
    original_project
    role { 'attachment' }
    sequence(:s3_key) { |n| "uploads/#{n}.png" }
    sequence(:filename) { |n| "#{n}.png" }
    size { 100 }
    content_type { 'image/png' }
  end

  factory :documents_s3_file do
    document
    s3_file
  end

  factory :settings do
    user
  end
end
