class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.belongs_to             :trip, index: true, foreign_key: true, type: :bigint, null: false
      t.integer                :lat_e6, null: false
      t.integer                :lng_e6, null: false
      t.integer                :time_estimation, null: false
      t.timestamps
    end
  end
end
