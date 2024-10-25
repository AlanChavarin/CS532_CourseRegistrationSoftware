ALTER TABLE "course_faculty" RENAME TO "course_qualified_faculty";--> statement-breakpoint
ALTER TABLE "course_qualified_faculty" DROP CONSTRAINT "course_faculty_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "course_qualified_faculty" DROP CONSTRAINT "course_faculty_faculty_id_faculty_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_qualified_faculty" ADD CONSTRAINT "course_qualified_faculty_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_qualified_faculty" ADD CONSTRAINT "course_qualified_faculty_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
