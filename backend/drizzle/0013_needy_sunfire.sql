ALTER TABLE "majors" RENAME COLUMN "department" TO "department_id";--> statement-breakpoint
ALTER TABLE "majors" ALTER COLUMN "department_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "majors" ALTER COLUMN "department_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "majors" ADD CONSTRAINT "majors_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
