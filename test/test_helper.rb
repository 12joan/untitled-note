ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/autorun'
require_relative 'api_test_case'

class ActiveSupport::TestCase
  ## Parallelization breaks Elasticsearch tests
  # parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
  include Devise::Test::IntegrationHelpers

  def as_user(user)
    sign_in(user)
  end

  def stub_s3_bucket(return_value, &block)
    Rails.application.config.stub(:s3_bucket, return_value, &block)
  end

  def ignore_s3
    s3_bucket = Class.new do
      def object(_)
        OpenStruct.new(delete: nil)
      end
    end.new

    stub_s3_bucket(s3_bucket) do
      yield
    end
  end

  module SlateJSONHelper
    class SlateJSONBuilder
      def initialize(type: nil, text: nil, **attributes)
        @type = type
        @text = text
        @attributes = attributes
        @children = []
      end

      def to_h
        {}.tap do |h|
          h.merge!(@attributes)
          h[:type] = @type unless @type.nil?
          h[:text] = @text unless @text.nil?
          h[:children] = children_to_h unless @children.empty?
        end
      end

      def children_to_h
        @children.map(&:to_h)
      end

      def text(text, **attributes)
        add_child(text: text, **attributes)
      end

      %i[p a h1 blockquote code_block ul ol li lic].each do |type|
        define_method(type) do |**attributes, &block|
          add_child(type: type, **attributes, &block)
        end
      end

      def mention(document_id:, fallback_text:, &block)
        add_child(type: 'mention', documentId: document_id, fallbackText: fallback_text, &block)
      end

      def attachment(s3_file_id:, filename:, &block)
        add_child(type: 'attachment', s3FileId: s3_file_id, filename: filename, &block)
      end

      private

      def add_child(**args, &block)
        child = self.class.new(**args)
        child.instance_eval &block if block_given?
        @children << child
      end
    end

    def create_document_body(&block)
      builder = SlateJSONBuilder.new
      builder.instance_eval &block
      builder.children_to_h.to_json
    end
  end
end
