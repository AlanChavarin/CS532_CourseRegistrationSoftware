CREATE TABLE IF NOT EXISTS "student_scheduled_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"scheduled_course_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_scheduled_courses" ADD CONSTRAINT "student_scheduled_courses_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_scheduled_courses" ADD CONSTRAINT "student_scheduled_courses_scheduled_course_id_scheduled_courses_id_fk" FOREIGN KEY ("scheduled_course_id") REFERENCES "public"."scheduled_courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
