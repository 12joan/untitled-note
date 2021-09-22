def if_requested(attr_name)
  yield if @requested_attributes.nil? || @requested_attributes.include?(attr_name)
end

if_requested(:id) { json.id document.id }
if_requested(:title) { json.title document.title }
if_requested(:blank) { json.blank document.blank }
if_requested(:created_at) { json.created_at document.created_at }
if_requested(:updated_at) { json.updated_at document.updated_at }
if_requested(:pinned_at) { json.pinned_at document.pinned_at }

if_requested(:body) { json.body document.body.body.as_json }
if_requested(:keywords) { json.keywords document.keywords, partial: '/api/v1/keywords/keyword', as: :keyword }
