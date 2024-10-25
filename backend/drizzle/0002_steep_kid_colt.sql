CREATE TABLE IF NOT EXISTS "major_faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"major_id" integer,
	"faculty_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "major_faculty" ADD CONSTRAINT "major_faculty_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "major_faculty" ADD CONSTRAINT "major_faculty_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
