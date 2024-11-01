ALTER TABLE "majors" ADD COLUMN "department_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "majors" ADD CONSTRAINT "majors_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
