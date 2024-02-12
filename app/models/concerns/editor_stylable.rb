module EditorStylable
  extend ActiveSupport::Concern

  included do
    enum editor_style: {
      casual: 0,
      literary: 1,
    }
  end
end
