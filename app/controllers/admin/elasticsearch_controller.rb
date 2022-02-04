class Admin::ElasticsearchController < ApplicationController
  def show
    @client = Elasticsearch::Model.client
    @cluster_health = @client.cluster.health
    @cluster_status = @cluster_health.fetch('status')
    @cluster_state = @client.cluster.state
    @index_names = @client.cat.indices(h: 'index').lines.map(&:chomp)
  end

  def create
    @command = params[:command]

    @response = 
      case @command
      when 'create_document_index'
        Document.__elasticsearch__.create_index!(force: true).inspect
      when 'refresh_document_index'
        Document.__elasticsearch__.refresh_index!(force: true).inspect
      when 'import_documents'
        Document.import.inspect
      else
        "Unexpected command: #{@command.inspect}"
      end
  rescue => error
    @response = error.inspect
  end
end
