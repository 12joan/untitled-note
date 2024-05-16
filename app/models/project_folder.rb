class ProjectFolder < ApplicationRecord
  include Listenable
  include Queryable.permit(*%i[ id name order_string created_at updated_at ])

  include Orderable.with(
    siblings: ->(pf) { pf.owner.project_folders },
    uniqueness_scope: :owner_id
  )

  belongs_to :owner, class_name: 'User', inverse_of: :project_folders
  has_many :projects, foreign_key: :folder_id, dependent: :nullify, inverse_of: :folder
end
