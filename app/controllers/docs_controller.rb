class DocsController < ApplicationController
  layout 'static'

  def show
    @pages = cached_pages
    @page = params.fetch(:page)
    raise ActiveRecord::RecordNotFound unless @pages.has_key?(@page)
    @content = @pages[@page]
  end

  private

  def pages
    {
      'self-hosting' => read_page('self_hosting.md'),
    }
  end

  MARKDOWN = Redcarpet::Markdown.new(
    Redcarpet::Render::HTML,
    autolink: true,
    tables: true,
    fenced_code_blocks: true,
    escape_html: true,
  )

  def read_page(*path_components)
    MARKDOWN.render(
      File.read(Rails.root.join('app', 'views', 'docs', *path_components))
    ).html_safe
  end

  def cached_pages
    if Rails.env.production?
      @@pages ||= pages
    else
      pages
    end
  end
end
