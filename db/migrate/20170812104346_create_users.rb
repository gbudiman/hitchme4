class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.string                 :email, null: false
      t.string                 :link, null: false
      t.string                 :name, index: true, null: false
      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
