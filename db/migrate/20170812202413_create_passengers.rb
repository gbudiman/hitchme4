class CreatePassengers < ActiveRecord::Migration[5.1]
  def change
    create_table :passengers, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.belongs_to             :trip, index: true, foreign_key: true, type: :bigint
      t.bigint                 :driver_id, index: true
      t.bigint                 :passenger_id, index: true, null: false
      t.string                 :address, null: false
      t.datetime               :pickup_time
      t.boolean                :mark_for_deletion, null: false, default: false

      t.timestamps
    end
  end
end
