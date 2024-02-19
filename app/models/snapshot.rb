class Snapshot < ApplicationRecord
  belongs_to :document
  has_one :owner, through: :document

  include Queryable.permit(*%i[id name manual body created_at updated_at])
  include Listenable
end
