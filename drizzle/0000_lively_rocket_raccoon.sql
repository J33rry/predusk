CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"summary" text,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"start_date" text,
	"end_date" text,
	"summary" text,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_email_idx" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "projects_profile_idx" ON "projects" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "projects_skills_idx" ON "projects" USING gin ("skills");--> statement-breakpoint
CREATE INDEX "projects_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "work_profile_idx" ON "work_experiences" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "work_company_idx" ON "work_experiences" USING btree ("company");