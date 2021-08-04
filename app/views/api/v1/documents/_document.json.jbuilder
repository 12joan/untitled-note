json.extract! document, :id, :body, :created_at, :updated_at
json.url api_v1_document_url(document, format: :json)
json.title document.title
json.body document.body.to_s
