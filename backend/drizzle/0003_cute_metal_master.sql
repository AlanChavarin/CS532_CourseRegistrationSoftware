CREATE TABLE IF NOT EXISTS "course_faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"faculty_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_faculty" ADD CONSTRAINT "course_faculty_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_faculty" ADD CONSTRAINT "course_faculty_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN IF EXISTS "qualified_faculty";