CREATE TABLE IF NOT EXISTS "course_waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"scheduled_course_id" integer,
	"position" integer NOT NULL,
	"request_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_waitlist" ADD CONSTRAINT "course_waitlist_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_waitlist" ADD CONSTRAINT "course_waitlist_scheduled_course_id_scheduled_courses_id_fk" FOREIGN KEY ("scheduled_course_id") REFERENCES "public"."scheduled_courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
