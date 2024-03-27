-- Create tables with UUID id columns and set default value
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" varchar,
  "role" UUID,
  "password_hash" varchar,
  "created_at" timestamp
);

CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID REFERENCES users(id),
  "expires" timestamp
)

CREATE TABLE "roles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "perm_add_movie" boolean,
  "perm_submit_set" boolean,
  "perm_review_set" boolean,
  "perm_user_rights_management" boolean,
  "perm_add_contributor" boolean
);

CREATE TABLE "movies" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar,
  "tmdb_id" varchar UNIQUE,
  "added_at" timestamp,
  "added_by" UUID
);

CREATE TABLE "cue_sets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar,
  "cue_source" varchar,
  "movie" UUID,
  "submitted_at" timestamp,
  "approved_at" timestamp,
  "approved_by" UUID
);

CREATE TABLE "cues_in_set" (
  "cue" UUID,
  "set" UUID,
  PRIMARY KEY ("cue", "set")
);

CREATE TABLE "cues" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "rank" integer,
  "slate" varchar,
  "title" varchar
);

CREATE TABLE "composers_in_cue" (
  "cue" UUID,
  "contributor" UUID,
  PRIMARY KEY ("cue", "contributor")
);

CREATE TABLE "orchestrators_in_cue" (
  "cue" UUID,
  "contributor" UUID,
  PRIMARY KEY ("cue", "contributor")
);

CREATE TABLE "contributors" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar,
  "tmdb_id" varchar UNIQUE
);

CREATE TABLE "db_version" (
  db_version int NOT NULL PRIMARY KEY
)

INSERT INTO db_version (db_version) VALUES (3)

-- Add foreign key constraints
ALTER TABLE "users" ADD FOREIGN KEY ("role") REFERENCES "roles" ("id");
ALTER TABLE "movies" ADD FOREIGN KEY ("added_by") REFERENCES "users" ("id");
ALTER TABLE "cue_sets" ADD FOREIGN KEY ("approved_by") REFERENCES "users" ("id");
ALTER TABLE "cue_sets" ADD FOREIGN KEY ("movie") REFERENCES "movies" ("id");
ALTER TABLE "cues_in_set" ADD FOREIGN KEY ("set") REFERENCES "cue_sets" ("id");
ALTER TABLE "cues_in_set" ADD FOREIGN KEY ("cue") REFERENCES "cues" ("id");
ALTER TABLE "composers_in_cue" ADD FOREIGN KEY ("cue") REFERENCES "cues" ("id");
ALTER TABLE "composers_in_cue" ADD FOREIGN KEY ("contributor") REFERENCES "contributors" ("id");
ALTER TABLE "orchestrators_in_cue" ADD FOREIGN KEY ("cue") REFERENCES "cues" ("id");
ALTER TABLE "orchestrators_in_cue" ADD FOREIGN KEY ("contributor") REFERENCES "contributors" ("id");

-- SOME BASE VALUES
INSERT INTO roles ('name' ,'perm_add_movie' ,'perm_submit_set' ,'perm_review_set' ,'perm_user_rights_management' ,'perm_add_contributor')
VALUES ('default', true, true, false, false, true)