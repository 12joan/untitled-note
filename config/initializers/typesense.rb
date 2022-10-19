typesense_url = URI.parse(ENV.fetch('TYPESENSE_URL'))

Rails.application.config.typesense = Typesense::Client.new(
  nodes: [{
    host: typesense_url.host,
    port: typesense_url.port,
    protocol: typesense_url.scheme
  }],
  api_key: ENV.fetch('TYPESENSE_API_KEY'),
  connection_timeout_seconds: 2,
)

# Each collection is tagged with a version number.
#
# If no collection with the latest version exists, we want to check for and
# delete any collections with an old version number and create a new one.

def define_collection(base_name, version:, &create)
  typesense = Rails.application.config.typesense

  prefix = "#{base_name}:"
  collection_name = "#{prefix}v#{version}"

  # Find all collections matching prefix (should be at most one)
  existing_collections = typesense.collections.retrieve
    .map { |collection| collection['name'] }
    .filter { |name| name.start_with?(prefix) }

  unless existing_collections.include?(collection_name)
    # Delete any collections with an old version number
    existing_collections.each do |collection|
      typesense.collections[collection].delete
    end

    # Create the new collection
    create.call(typesense, collection_name)
  end

  typesense.collections[collection_name]
end

Rails.configuration.after_initialize do
  Rails.application.config.typesense_collections = OpenStruct.new(
    documents: define_collection('documents', version: '0.5') do |typesense, collection_name|
      typesense.collections.create(
        name: collection_name,
        fields: [
          { name: 'project_id', type: 'int32' },
          { name: 'title', type: 'string', optional: true },
          { name: 'plain_body', type: 'string' },
        ],
      )

      Document.reindex_typesense_collection(collection: typesense.collections[collection_name])
    end
  )
end
