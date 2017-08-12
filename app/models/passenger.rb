class LoosePassengerValidator < ActiveModel::Validator
  def validate record
    if record.trip_id != nil
      unless Trip.find(record.trip_id)
        record.errors[:name] << 'Picked up Passenger must have valid Trip ID'
      end
    end
  end
end

class Passenger < ApplicationRecord
  include ActiveModel::Validations

  validates :address, presence: true
  validates_with LoosePassengerValidator

  belongs_to :user, foreign_key: :passenger_id
  validates :user, presence: true

  def self.load_example! count: 1
    trip = Trip.load_example!
    hitchers = User.load_example! count: count, skip: 1
    passengers = Array.new

    count.times do |i|
      passengers.push(Passenger.create! passenger_id: hitchers[0].id,
                                        address: 'Some random address')
    end

    return { trip: trip, passengers: passengers }
  end

  def assign_trip trip, pickup_time:
    self.trip_id = trip.id
    self.driver_id = trip.user_id
    self.pickup_time = pickup_time
    self.save!
  end

  def is_assigned_to_trip?
    return (self.trip_id != nil and self.driver_id != nil)
  end
end

