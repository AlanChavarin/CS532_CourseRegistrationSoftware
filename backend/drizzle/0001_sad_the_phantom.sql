CREATE TABLE IF NOT EXISTS "course_majors" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"major_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_majors" ADD CONSTRAINT "course_majors_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_majors" ADD CONSTRAINT "course_majors_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
