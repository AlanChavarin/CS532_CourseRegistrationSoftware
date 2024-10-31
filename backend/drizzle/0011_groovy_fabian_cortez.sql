ALTER TABLE "scheduled_courses" ADD COLUMN "seats" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "scheduled_courses" ADD COLUMN "available_seats" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "scheduled_courses" ADD COLUMN "semester" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "scheduled_courses" ADD COLUMN "year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "student_scheduled_courses" ADD COLUMN "grade" varchar(2);--> statement-breakpoint
ALTER TABLE "student_scheduled_courses" ADD COLUMN "is_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_scheduled_courses" ADD COLUMN "enrollment_date" timestamp DEFAULT now() NOT NULL;