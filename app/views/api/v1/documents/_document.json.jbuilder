json.extract! document, :id, :title, :created_at, :updated_at
json.url api_v1_project_document_url(document.project, document, format: :json)
json.body document.body.body.as_json
