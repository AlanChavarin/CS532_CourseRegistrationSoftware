ALTER TABLE "majors" DROP CONSTRAINT "majors_department_id_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "majors" DROP COLUMN IF EXISTS "department_id";