class Trip < ApplicationRecord
  belongs_to :user
  validates :user, presence: true

  belongs_to :event
  validates :event, presence: true

  validates :encoded_polylines, presence: true
  validates :time_start, presence: true
  validates :address, presence: true
  validates :space_passenger, presence: true
  validates :space_cargo, presence: true

  enum trip_types: [ :to_event, :to_home ]

  def self.load_example!
    event = Event.load_example!
    user = User.find(event.user_id)

    return Trip.create! user_id: user.id,
                        event_id: event.id,
                        encoded_polylines: '842|3513|341|16',
                        time_start: '2017 Aug 18 14:00',
                        address: 'Los Angeles, CA',
                        space_passenger: 2,
                        space_cargo: 2,
                        trip_type: Trip.trip_types[:to_event]
  end

  def assign_passenger passenger, pickup_time:
    passenger.trip_id = self.id
    passenger.driver_id = self.user_id
    passenger.pickup_time = pickup_time
    passenger.save!
  end
end
