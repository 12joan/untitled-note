# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_05_10_182414) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "documents", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id", null: false
    t.boolean "blank", default: false, null: false
    t.datetime "pinned_at", precision: nil
    t.string "title"
    t.text "plain_body", default: "", null: false
    t.text "body", default: "", null: false
    t.string "body_type", default: "empty", null: false
    t.string "updated_by", default: "server", null: false
    t.datetime "locked_at"
    t.integer "editor_style"
    t.integer "auto_snapshots_option"
    t.index ["project_id"], name: "index_documents_on_project_id"
  end

  create_table "documents_s3_files", force: :cascade do |t|
    t.bigint "document_id", null: false
    t.bigint "s3_file_id", null: false
    t.index ["document_id", "s3_file_id"], name: "index_documents_s3_files_on_document_id_and_s3_file_id"
    t.index ["s3_file_id", "document_id"], name: "index_documents_s3_files_on_s3_file_id_and_document_id"
  end

  create_table "documents_tags", force: :cascade do |t|
    t.bigint "document_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["document_id"], name: "index_documents_tags_on_document_id"
    t.index ["tag_id"], name: "index_documents_tags_on_tag_id"
  end

  create_table "login_sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token", null: false
    t.string "user_agent", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_login_sessions_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "owner_id", default: 1, null: false
    t.bigint "image_id"
    t.integer "list_index"
    t.datetime "archived_at"
    t.string "background_colour", default: "auto", null: false
    t.string "emoji"
    t.integer "editor_style"
    t.integer "auto_snapshots_option"
    t.index ["image_id"], name: "index_projects_on_image_id"
    t.index ["owner_id"], name: "index_projects_on_owner_id"
  end

  create_table "s3_files", force: :cascade do |t|
    t.bigint "original_project_id"
    t.string "role"
    t.string "s3_key"
    t.string "filename"
    t.integer "size"
    t.string "content_type"
    t.boolean "uploaded_cache", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "owner_id", null: false
    t.datetime "became_unused_at", precision: nil
    t.boolean "do_not_delete_unused", default: false, null: false
    t.index ["original_project_id"], name: "index_s3_files_on_original_project_id"
    t.index ["owner_id"], name: "index_s3_files_on_owner_id"
  end

  create_table "settings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "legacy_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "keyboard_shortcut_overrides", default: {}, null: false
    t.boolean "deeper_dark_mode", default: false, null: false
    t.integer "editor_style", default: 0, null: false
    t.integer "auto_snapshots_option", default: 0, null: false
    t.integer "recents_type", default: 0, null: false
    t.index ["user_id"], name: "index_settings_on_user_id"
  end

  create_table "snapshots", force: :cascade do |t|
    t.bigint "document_id", null: false
    t.string "name", default: "", null: false
    t.boolean "manual", default: true, null: false
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "restores_snapshot_id"
    t.index ["document_id"], name: "index_snapshots_on_document_id"
    t.index ["restores_snapshot_id"], name: "index_snapshots_on_restores_snapshot_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "text"
    t.bigint "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "sequence", default: false, null: false
    t.index ["project_id"], name: "index_tags_on_project_id"
    t.index ["text", "project_id"], name: "index_tags_on_text_and_project_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "auth0_id"
    t.string "name", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "storage_used", default: 0, null: false
    t.integer "storage_quota", default: 10485760, null: false
    t.boolean "allow_stub_login", default: false, null: false
  end

  add_foreign_key "documents", "projects"
  add_foreign_key "documents_tags", "documents"
  add_foreign_key "documents_tags", "tags"
  add_foreign_key "login_sessions", "users"
  add_foreign_key "projects", "s3_files", column: "image_id"
  add_foreign_key "projects", "users", column: "owner_id"
  add_foreign_key "s3_files", "projects", column: "original_project_id"
  add_foreign_key "s3_files", "users", column: "owner_id"
  add_foreign_key "settings", "users"
  add_foreign_key "snapshots", "documents"
  add_foreign_key "snapshots", "snapshots", column: "restores_snapshot_id"
  add_foreign_key "tags", "projects"
end
