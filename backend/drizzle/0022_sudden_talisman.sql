ALTER TABLE "courses" ADD COLUMN "code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_code_unique" UNIQUE("code");