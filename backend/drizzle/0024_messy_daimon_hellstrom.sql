ALTER TABLE "departments" ADD COLUMN "department_code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_department_code_unique" UNIQUE("department_code");