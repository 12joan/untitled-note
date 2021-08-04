json.extract! document, :id, :body, :created_at, :updated_at
json.url api_v1_project_document_url(document.project, document, format: :json)
json.title document.title
json.body document.body.to_s
