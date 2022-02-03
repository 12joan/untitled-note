module API
  module V1
    class DocumentSearchController < ApplicationController
      before_action :set_project

      def show
        search = {
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
                  type: 'phrase',
                  fields: ['title^5', 'plain_body'],
                },
              },
            },
          },
        }

        selection_query = params[:select].then { JSON.parse(_1) rescue _1 }

        document_data = Document.search(search).records.to_a.map do |document|
          document.query(selection_query) 
        end

        render json: document_data
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
      end
    end
  end
end
