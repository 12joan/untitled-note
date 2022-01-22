require 'test_helper'

class SanitizeHtmlTest < ActiveSupport::TestCase
  test 'permits listed tags and attributes' do
    html = <<~HTML.delete("\n")
      <p>Paragraph</p>
      <p>Line<br>break</p>
      <p><a href="https://example.com">Safe link</a></p>
    HTML

    assert_equal html, SanitizeHtml.(html)
  end

  test 'strips out arbitrary tags' do
    refute_includes SanitizeHtml.('<script>alert("xss")</script>'), 'script'
    refute_includes SanitizeHtml.('<banana>alert("xss")</banana>'), 'banana'
  end

  test 'strips out arbitrary attributes' do
    assert_equal '<p>Hello</p>', SanitizeHtml.('<p id="...">Hello</p>')
    assert_equal '<p>Hello</p>', SanitizeHtml.('<p onload="...">Hello</p>')
  end

  test 'strips out javascript protocol' do
    refute_includes SanitizeHtml.('<a href="javascript:alert(\'xss\')">click me</a>'), 'xss'
  end

  test 'permits block comments' do
    html = '<li><!--block-->Hello world</li>'

    assert_equal html, SanitizeHtml.(html)
  end

  test 'strips out arbitrary comments' do
    refute_includes SanitizeHtml.('<!--xss-->'), 'xss'
  end
end
