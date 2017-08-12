class Provider < ApplicationRecord
  enum providers: [ :facebook ]
  validates :uid, presence: true
  belongs_to :user
  validates :user, presence: true
end
