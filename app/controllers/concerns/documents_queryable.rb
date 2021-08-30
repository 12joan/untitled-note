module DocumentsQueryable
  extend ActiveSupport::Concern

  included do
    helper_method :query_documents
  end

  def query_documents(collection, options = {})
    scoped_collection = apply_scopes(collection, [
      options.fetch(:pinned, false) ? :pinned : :all,
      :not_blank,
    ])

    sort_param = validate_param(
      options.fetch(:sort_by, 'created_at'),
      allowed_values: ['created_at', 'updated_at', 'pinned_at'],
    )

    sort_direction = validate_param(
      options.fetch(:sort_direction, 'desc'),
      allowed_values: ['asc', 'desc'],
    )

    scoped_collection.order(sort_param => sort_direction)
  end

  private

  def apply_scopes(collection, scopes)
    scopes.reduce(collection) { |collection, scope| collection.send(scope) }
  end

  def validate_param(value, allowed_values:)
    allowed_values.map { [_1, _1] }.to_h.fetch(value)
  end
end
