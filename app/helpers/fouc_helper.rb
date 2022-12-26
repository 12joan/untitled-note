module FoucHelper
  def prevent_fouc_tags
    ''.tap do |buffer|
      buffer << vite_javascript_tag('fouc.jsx')

      buffer << tag.style(type: 'text/css') do
        <<~CSS
        .prevent-fouc {
          display: none;
        }
        CSS
      end
    end.html_safe
  end
end
