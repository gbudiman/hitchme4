class Event < ApplicationRecord
  belongs_to :user
  validates :user, presence: true

  validates :name, presence: true
  validates :address, presence: true
  validates :time_start, presence: true

  def self.load_example!
    user = User.load_example!
    return Event.create! user_id: user.id,
                         name: 'Dystopia Rising SoCal 2017 August',
                         address: '14600 Baron Dr, Eastvale, CA',
                         time_start: '2017 Aug 18 20:00'
  end

  def self.load_multi user_id:, h:
    ActiveRecord::Base.transaction do
      h[:dates].each do |date|
        Event.create! user_id: user_id,
                      name: h[:name],
                      address: h[:address],
                      time_start: Time.at(date.to_i)
      end
    end
  end
end
