CREATE TABLE IF NOT EXISTS "course_prerequisites" (
	"course_id" integer,
	"prerequisite_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_prerequisite_id_courses_id_fk" FOREIGN KEY ("prerequisite_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "prerequisites";