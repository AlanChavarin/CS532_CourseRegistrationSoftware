CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"required_courses" jsonb DEFAULT '[]'::jsonb,
	"elective_courses" jsonb DEFAULT '[]'::jsonb,
	"advisors" jsonb DEFAULT '[]'::jsonb
);
