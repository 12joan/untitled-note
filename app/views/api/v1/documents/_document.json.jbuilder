json.extract! document, :id, :title, :blank, :created_at, :updated_at, :deleted_at
json.url api_v1_project_document_url(document.project, document, format: :json)
json.body document.body.body.as_json
json.keywords document.keywords, partial: '/api/v1/keywords/keyword', as: :keyword
