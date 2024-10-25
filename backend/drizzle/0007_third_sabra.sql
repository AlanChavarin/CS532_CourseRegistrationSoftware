CREATE TABLE IF NOT EXISTS "faculty_departments_involved_in" (
	"id" serial PRIMARY KEY NOT NULL,
	"faculty_id" integer,
	"department_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_departments_involved_in" ADD CONSTRAINT "faculty_departments_involved_in_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "faculty_departments_involved_in" ADD CONSTRAINT "faculty_departments_involved_in_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
