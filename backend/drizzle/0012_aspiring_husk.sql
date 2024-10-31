CREATE TABLE IF NOT EXISTS "transfer_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"student_id" integer,
	"university_name" varchar(255) NOT NULL,
	"university_location" varchar(255) NOT NULL,
	"original_course_code" varchar(255) NOT NULL,
	"grade" varchar(2) NOT NULL,
	"semester" varchar(20) NOT NULL,
	"year" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfer_credits" ADD CONSTRAINT "transfer_credits_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfer_credits" ADD CONSTRAINT "transfer_credits_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
