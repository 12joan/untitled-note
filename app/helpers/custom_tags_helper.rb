module CustomTagsHelper
  class << self
    def define_styled_helper(styled_helper_name, original_helper_name, custom_class)
      define_method(styled_helper_name) do |*args, &block|
        options = args.extract_options!
        options[:class] ||= ''
        options[:class] += " #{custom_class}"
        options[:class].strip!
        args << options
        send(original_helper_name, *args, &block)
      end
    end
  end

  define_styled_helper :styled_link_to, :link_to, 'btn btn-link font-medium'
  define_styled_helper :styled_button_to, :link_to, 'btn btn-rect btn-primary inline-block'

  define_styled_helper :styled_submit_link, :submit_tag, 'btn btn-link font-medium'
  define_styled_helper :styled_submit_button, :submit_tag, 'btn btn-rect btn-primary'
end
