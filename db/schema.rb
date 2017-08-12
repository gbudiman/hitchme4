# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170812202429) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "events", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "address", null: false
    t.datetime "time_start", null: false
    t.datetime "time_end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address"], name: "index_events_on_address"
    t.index ["name"], name: "index_events_on_name"
    t.index ["time_start"], name: "index_events_on_time_start"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "passengers", force: :cascade do |t|
    t.bigint "trip_id"
    t.bigint "driver_id"
    t.bigint "passenger_id", null: false
    t.string "address", null: false
    t.datetime "pickup_time"
    t.boolean "mark_for_deletion", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["driver_id"], name: "index_passengers_on_driver_id"
    t.index ["passenger_id"], name: "index_passengers_on_passenger_id"
    t.index ["trip_id"], name: "index_passengers_on_trip_id"
  end

  create_table "providers", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "provider", null: false
    t.string "uid", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_providers_on_provider_and_uid", unique: true
    t.index ["user_id"], name: "index_providers_on_user_id"
  end

  create_table "steps", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.integer "lat_e6", null: false
    t.integer "lng_e6", null: false
    t.integer "time_estimation", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_steps_on_trip_id"
  end

  create_table "trips", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "event_id", null: false
    t.text "encoded_polylines", null: false
    t.datetime "time_start", null: false
    t.string "address", null: false
    t.integer "space_passenger", null: false
    t.integer "space_cargo", null: false
    t.integer "trip_type", null: false
    t.boolean "mark_for_deletion", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_trips_on_event_id"
    t.index ["user_id", "event_id", "trip_type"], name: "index_trips_on_user_id_and_event_id_and_trip_type", unique: true
    t.index ["user_id"], name: "index_trips_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "link", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["name"], name: "index_users_on_name"
  end

  add_foreign_key "events", "users"
  add_foreign_key "passengers", "trips"
  add_foreign_key "providers", "users"
  add_foreign_key "steps", "trips"
  add_foreign_key "trips", "events"
  add_foreign_key "trips", "users"
end
