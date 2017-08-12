class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.belongs_to             :user, index: true, foreign_key: true, type: :bigint, null: false
      t.string                 :name, null: false, index: true
      t.string                 :address, null: false, index: true
      t.datetime               :time_start, null: false, index: true
      t.datetime               :time_end         
      t.timestamps
    end
  end
end
