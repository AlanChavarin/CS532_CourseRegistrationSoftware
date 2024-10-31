CREATE TABLE IF NOT EXISTS "major_requirements" (
	"id" serial PRIMARY KEY NOT NULL,
	"major_id" integer,
	"course_id" integer,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_elective" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_graduate_level" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "major_requirements" ADD CONSTRAINT "major_requirements_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "major_requirements" ADD CONSTRAINT "major_requirements_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
