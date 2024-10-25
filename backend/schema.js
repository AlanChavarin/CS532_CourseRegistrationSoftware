const { pgTable, serial, varchar, text, boolean, integer, uuid, jsonb, pgEnum, primaryKey } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const weekDayEnum = pgEnum('week_day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const userTypeEnum = pgEnum('user_type', ['faculty', 'student']);

const majors = pgTable('majors', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  description: text('description')
});

const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  headFacultyId: integer('head_faculty_id').references(() => faculty.id),
});

const dates = pgTable('dates', {
  id: serial('id').primaryKey(),
  day: weekDayEnum('day').notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(),
  endTime: varchar('end_time', { length: 5 }).notNull(),
  scheduledCourseId: integer('scheduled_course_id').references(() => scheduledCourses.id),
  facultyId: integer('faculty_id').references(() => faculty.id)
});

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  userType: userTypeEnum('user_type').notNull(),
  facultyId: integer('faculty_id').references(() => faculty.id),
  studentId: integer('student_id').references(() => students.id)
});


const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  majorId: integer('major_id').references(() => majors.id).notNull(),
  minorId: integer('minor_id').references(() => majors.id),
  notes: text('notes'),
  userId: integer('user_id').references(() => users.id).notNull()
});

const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  positionTitle: varchar('position_title', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  officeNumber: varchar('office_number', { length: 50 }),
  mainDepartment: integer('main_department_id').references(() => departments.id),
  userId: integer('user_id').references(() => users.id).notNull()
});


const scheduledCourses = pgTable('scheduled_courses', {
  id: serial('id').primaryKey(),
  scheduleNumber: varchar('schedule_number', { length: 20 }).notNull().unique(),
  instructorId: integer('instructor_id').references(() => faculty.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  location: varchar('location', { length: 100 }).notNull()
});

const courses  = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  prerequisites: jsonb('prerequisites').default([]),
  units: integer('units').notNull(),
  qualifiedFaculty: jsonb('qualified_faculty').default([]),
  departmentId: integer('department_id').references(() => departments.id),
});

const userRelations = relations(users, ({ one }) => ({
  faculty: one(faculty, {
    fields: [users.facultyId],
    references: [faculty.id]
  }),
  student: one(students, {
    fields: [users.studentId],
    references: [students.id]
  })
}));

const majorRelations = relations(majors, ({ many }) => ({
  studentsWithMajor: many(students, { relationName: "studentMajor" }),
  studentsWithMinor: many(students, { relationName: "studentMinor" }),
  courses: many(courses),
  faculty: many(faculty),
}));

const courseRelations = relations(courses, ({ many, one }) => ({
  majors: many(majors),
  faculty: many(faculty),
  advisors: many(faculty),
  prerequisites: many(courses),
  scheduledCourses: many(scheduledCourses),
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id]
  }),
}));

const facultyRelations = relations(faculty, ({ one, many }) => ({
  user: one(users, {
    fields: [faculty.userId],
    references: [users.id]
  }),
  mainDepartment: one(departments, {
    fields: [faculty.mainDepartment],
    references: [departments.id]
  }),
  courses: many(courses),
  scheduledCourses: many(scheduledCourses)
}));

const scheduledCourseRelations = relations(scheduledCourses, ({ one }) => ({
  instructor: one(faculty, {
    fields: [scheduledCourses.instructorId],
    references: [faculty.id]
  }),
  course: one(courses, {
    fields: [scheduledCourses.courseId],
    references: [courses.id]
  })

}));

const departmentRelations = relations(departments, ({ one, many }) => ({
  headFaculty: one(faculty, {
    fields: [departments.headFacultyId],
    references: [faculty.id]
  }),
  courses: many(courses),
  faculty: many(faculty)
}));

const dateRelations = relations(dates, ({ one }) => ({
  scheduledCourse: one(scheduledCourses, {
    fields: [dates.scheduledCourseId],
    references: [scheduledCourses.id]
  }),
  faculty: one(faculty, {
    fields: [dates.facultyId],
    references: [faculty.id]
  })
}));

const studentRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id]
  }),
  major: one(majors, {
    fields: [students.majorId],
    references: [majors.id],
    relationName: "studentMajor"
  }),
  minor: one(majors, {
    fields: [students.minorId],
    references: [majors.id],
    relationName: "studentMinor"
  })

}));


module.exports = {
    weekDayEnum,
    userTypeEnum,
    majors,
    users,
    students,
    faculty,
    departments,
    scheduledCourses,
    courses,
    dates,
    majorRelations,
    userRelations,
    studentRelations,
    facultyRelations,
    departmentRelations,
    scheduledCourseRelations,
    courseRelations,
    dateRelations
};
