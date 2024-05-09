DO $$ BEGIN
 CREATE TYPE "public"."entity_type" AS ENUM('task', 'attachment_reference');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."mime_type" AS ENUM('image/png', 'image/jpeg', 'image/svg+xml');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"last_event_id" bigserial NOT NULL,
	"created_at_timestamp_millis" timestamp with time zone DEFAULT now(),
	"last_event_timestamp_millis" timestamp with time zone NOT NULL,
	"user_id" uuid NOT NULL,
	"is_deleted" boolean,
	"provenance" jsonb,
	"spec" jsonb,
	"component_states" jsonb,
	"mime_type" "mime_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"timestamp_millis" timestamp with time zone DEFAULT now() NOT NULL,
	"entity_id" serial NOT NULL,
	"subfields" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password_hash" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at_timestamp_millis" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_last_event_id_events_id_fk" FOREIGN KEY ("last_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_event_timestamp_idx" ON "entities" ("last_event_timestamp_millis");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "entities" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entity_id_idx" ON "events" ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");