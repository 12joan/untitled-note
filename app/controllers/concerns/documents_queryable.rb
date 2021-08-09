module DocumentsQueryable
  extend ActiveSupport::Concern

  included do
    helper_method :query_documents
  end

  def query_documents(collection, options = {})
    collection.all.order(
      validate_param(
        options.fetch(:sort_by, 'created_at'),
        allowed_values: ['created_at', 'updated_at'],
      )
    )
  end

  private

  def validate_param(value, allowed_values:)
    allowed_values.map { [_1, _1] }.to_h.fetch(value)
  end
end
