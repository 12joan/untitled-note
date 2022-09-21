module API
  module V1
    class DocumentMarkdownController < ApplicationController
      before_action :set_project
      before_action :set_document

      def show
        preprocessed_html = @document.body.dup.tap do |html|
          # Ensure newlines are not removed from code blocks
          html.gsub!('<pre>', '<pre><code>')
          html.gsub!('</pre>', '</code></pre>')

          # Strip whitespace from beginning and end of each line
          html.gsub!(/\s*(\n+)\s*/, '\1')
        end

        preprocessed_markdown = ReverseMarkdown.convert(preprocessed_html, github_flavored: true).tap do |markdown|
          # Convert heading 1s to heading 2s 
          markdown.gsub!(/^# /, '## ')

          # Prepend the document title, if present
          markdown.prepend("# #{@document.title}\n\n") if @document.title.present?
        end

        send_data preprocessed_markdown, type: 'text/markdown', filename: (@document.title.presence || 'document') + '.md'
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def set_project
        @project = Project.find(params[:project_id])
      end

      def set_document
        @document = @project.documents.find(params[:document_id])
      end
    end
  end
end
