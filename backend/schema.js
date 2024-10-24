const { pgTable, serial, varchar, text, boolean, integer, uuid, jsonb, pgEnum, primaryKey } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const weekDayEnum = pgEnum('week_day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const userTypeEnum = pgEnum('user_type', ['faculty', 'student']);

const major = pgTable('majors', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }).notNull()
});

const department = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  headFacultyId: integer('head_faculty_id').references(() => faculty.id),
});

const date = pgTable('dates', {
  day: weekDayEnum('day').notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(),
  endTime: varchar('end_time', { length: 5 }).notNull()
});

const user = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  userType: userTypeEnum('user_type').notNull(),
  facultyId: integer('faculty_id').references(() => faculty.id),
  studentId: integer('student_id').references(() => student.id)
});

const userRelations = relations(user, ({ one }) => ({
  faculty: one(faculty, {
    fields: [user.facultyId],
    references: [faculty.id]
  }),
  student: one(student, {
    fields: [user.studentId],
    references: [student.id]
  })
}));

const student = pgTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  majorId: integer('major_id').references(() => major.id).notNull(),
  minorId: integer('minor_id').references(() => major.id),
  notes: text('notes'),
  userId: integer('user_id').references(() => user.id).notNull()
});

const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  positionTitle: varchar('position_title', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  officeNumber: varchar('office_number', { length: 50 }),
  mainDepartment: integer('main_department_id').references(() => department.id),
  userId: integer('user_id').references(() => user.id).notNull()
});

const scheduledCourse = pgTable('scheduled_courses', {
  id: serial('id').primaryKey(),
  scheduleNumber: varchar('schedule_number', { length: 20 }).notNull().unique(),
  instructorId: integer('instructor_id').references(() => faculty.id).notNull(),
  courseId: integer('course_id').references(() => course.id).notNull(),
  location: varchar('location', { length: 100 }).notNull()
});

const course = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  prerequisites: jsonb('prerequisites').default([]),
  units: integer('units').notNull(),
  qualifiedFaculty: jsonb('qualified_faculty').default([]),
  departmentId: integer('department_id').references(() => department.id),
});

const majorRelations = relations(major, ({ many }) => ({
  students: many(student),
  courses: many(course),
  faculty: many(faculty),
}));

const courseRelations = relations(course, ({ many, one }) => ({
  faculty: many(faculty),
  advisors: many(faculty),
  prerequisites: many(course),
  scheduledCourses: many(scheduledCourse),
  department: one(department, {
    fields: [course.departmentId],
    references: [department.id]
  }),
  majors: many(major)
}));

const facultyRelations = relations(faculty, ({ one, many }) => ({
  user: one(user, {
    fields: [faculty.userId],
    references: [user.id]
  }),
  mainDepartment: one(department, {
    fields: [faculty.mainDepartment],
    references: [department.id]
  }),
  courses: many(course),
  scheduledCourses: many(scheduledCourse)
}));

const scheduledCourseRelations = relations(scheduledCourse, ({ one }) => ({
  instructor: one(faculty, {
    fields: [scheduledCourse.instructorId],
    references: [faculty.id]
  }),
  course: one(course, {
    fields: [scheduledCourse.courseId],
    references: [course.id]
  })

}));

const departmentRelations = relations(department, ({ one, many }) => ({
  headFaculty: one(faculty, {
    fields: [department.headFacultyId],
    references: [faculty.id]
  }),
  courses: many(course),
  faculty: many(faculty)
}));

const dateRelations = relations(date, ({ one }) => ({
  scheduledCourses: one(scheduledCourse, {
    fields: [date.scheduledCourseId],
    references: [scheduledCourse.id]
  }),
  faculty: one(faculty, {
    fields: [date.facultyId],
    references: [faculty.id]
  })
}));

const studentRelations = relations(student, ({ one }) => ({
  user: one(user, {
    fields: [student.userId],
    references: [user.id]
  }),
  major: one(major, {
    fields: [student.majorId],
    references: [major.id]
  }),
  minor: one(major, {
    fields: [student.minorId],
    references: [major.id]
  })

}));


module.exports = {
    weekDayEnum,
    userTypeEnum,
    major,
    user,
    student,
    faculty,
    department,
    scheduledCourse,
    course,
    date,
    majorRelations,
    userRelations,
    studentRelations,
    facultyRelations,
    departmentRelations,
    scheduledCourseRelations,
    courseRelations,
    dateRelations
};
