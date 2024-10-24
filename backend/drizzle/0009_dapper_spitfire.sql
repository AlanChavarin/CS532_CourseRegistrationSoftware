CREATE TABLE IF NOT EXISTS "dates" (
	"day" "week_day" NOT NULL,
	"start_time" varchar(5) NOT NULL,
	"end_time" varchar(5) NOT NULL
);
--> statement-breakpoint
DROP TABLE "course_faculty";--> statement-breakpoint
ALTER TABLE "scheduled_courses" DROP COLUMN IF EXISTS "time_held";