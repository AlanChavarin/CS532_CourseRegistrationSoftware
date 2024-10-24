CREATE TABLE IF NOT EXISTS "scheduled_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_number" varchar(20) NOT NULL,
	"instructor_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"time_held" varchar(50) NOT NULL,
	"location" varchar(100) NOT NULL,
	CONSTRAINT "scheduled_courses_schedule_number_unique" UNIQUE("schedule_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"prerequisites" jsonb DEFAULT '[]'::jsonb,
	"units" integer NOT NULL,
	"qualified_faculty" jsonb DEFAULT '[]'::jsonb,
	"department_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_courses" ADD CONSTRAINT "scheduled_courses_instructor_id_faculty_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scheduled_courses" ADD CONSTRAINT "scheduled_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
