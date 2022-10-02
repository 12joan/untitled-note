module API
  module V1
    class DocumentSearchController < APIController
      before_action :set_project

      def show
        search = {
          size: 9,

          query: {
            bool: {
              filter: {
                term: {
                  project_id: @project.id,
                },
              },

              must: {
                multi_match: {
                  query: params[:q],
                  fields: ['title^5', 'plain_body'],
                  type: 'bool_prefix',
                  operator: 'or',
                },
              },
            },
          },

          highlight: {
            fields: {
              plain_body: {
                pre_tags: ['<strong>'],
                post_tags: ['</strong>'],
                fragment_size: 32,
                number_of_fragments: 3,
              },
            },
          },
        }

        search_response = Document.search(search)

        selection_query = params[:select].then { JSON.parse(_1) rescue _1 }

        document_data = search_response.records.map do |document|
          document.query(selection_query) 
        end

        highlights = search_response.results.map do |result|
          if result.highlight?
            result.highlight.fetch('plain_body').join(' ')
          else
            nil
          end
        end

        response_data = document_data.zip(highlights).map do |document, highlight|
          { document: document, highlight: highlight }
        end

        render json: response_data
      end
    end
  end
end
