class CreateProviders < ActiveRecord::Migration[5.1]
  def change
    create_table :providers, id: false do |t|
      t.bigserial              :id, primary_key: true
      t.belongs_to             :user, index: true, foreign_key: true, type: :bigint, null: false
      t.string                 :provider, null: false
      t.string                 :uid, null: false
      t.timestamps
    end

    add_index :providers, [:provider, :uid], unique: true
  end
end
