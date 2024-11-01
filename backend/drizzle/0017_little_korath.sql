CREATE TYPE "public"."semester" AS ENUM('Fall', 'Spring', 'Summer', 'Winter');--> statement-breakpoint
ALTER TABLE "scheduled_courses" ALTER COLUMN "semester" SET DATA TYPE semester;--> statement-breakpoint
ALTER TABLE "transfer_credits" ALTER COLUMN "semester" SET DATA TYPE semester;