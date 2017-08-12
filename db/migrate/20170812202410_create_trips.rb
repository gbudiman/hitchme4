class CreateTrips < ActiveRecord::Migration[5.1]
  def change
    create_table :trips, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.belongs_to             :user, index: true, foreign_key: true, type: :bigint, null: false
      t.belongs_to             :event, index: true, foreign_key: true, type: :bigint, null: false   
      t.text                   :encoded_polylines, null: false
      t.datetime               :time_start, null: false
      t.string                 :address, null: false
      t.integer                :space_passenger, null: false
      t.integer                :space_cargo, null: false
      t.integer                :trip_type, null: false
      t.boolean                :mark_for_deletion, null: false, default: false
      t.timestamps
    end

    add_index :trips, [:user_id, :event_id, :trip_type], unique: true
  end
end
