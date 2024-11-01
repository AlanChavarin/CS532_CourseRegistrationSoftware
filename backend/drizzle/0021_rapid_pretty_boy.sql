ALTER TABLE "scheduled_courses" DROP CONSTRAINT "scheduled_courses_schedule_number_unique";--> statement-breakpoint
ALTER TABLE "scheduled_courses" DROP COLUMN IF EXISTS "schedule_number";