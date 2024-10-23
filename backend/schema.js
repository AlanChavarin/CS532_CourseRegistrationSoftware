const { pgTable, serial, varchar, text, boolean, integer, uuid, jsonb } = require('drizzle-orm/pg-core');

const major = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  requiredCourses: jsonb('required_courses').default([]),
  electiveCourses: jsonb('elective_courses').default([]),
  advisors: jsonb('advisors').default([])
});

module.exports = {
    major
};
