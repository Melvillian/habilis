DO $$ BEGIN
 CREATE TYPE "public"."card_type" AS ENUM('cloze', 'qa');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('cardAdded', 'cardRemoved', 'cardUpdated', 'repetition');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"last_event_id" uuid NOT NULL,
	"created_at_timestamp_millis" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "card_type" NOT NULL,
	"is_deleted" boolean NOT NULL,
	"last_repetition_timestamp_millis" timestamptz[] NOT NULL,
	"due_timestamp_millis" timestamptz[] NOT NULL,
	"interval_millis" integer[] NOT NULL,
	"card_text" text NOT NULL,
	"attachments" jsonb[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at_timestamp_millis" timestamp with time zone DEFAULT now() NOT NULL,
	"card_id" uuid NOT NULL,
	"type" "type" NOT NULL,
	"subfields" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password_hash" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at_timestamp_millis" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_last_event_id_events_id_fk" FOREIGN KEY ("last_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_event_id_idx" ON "cards" ("last_event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "cards" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "due_timestamp_millis_idx" ON "cards" ("due_timestamp_millis");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "card_id_idx" ON "events" ("card_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");