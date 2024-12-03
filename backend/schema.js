const { pgTable, serial, varchar, text, boolean, integer, uuid, jsonb, pgEnum, primaryKey, timestamp, real, index } = require('drizzle-orm/pg-core');
const { relations, sql } = require('drizzle-orm');
const weekDayEnum = pgEnum('week_day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const userTypeEnum = pgEnum('user_type', ['faculty', 'student']);
const semesterEnum = pgEnum('semester', ['Fall', 'Spring', 'Summer', 'Winter']);

const majors = pgTable('majors', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  departmentId: integer('department_id').references(() => departments.id),
  description: text('description'),
  requiredUnits: integer('required_units').notNull().default(0)
}, (table) => {
  return {
    titleIdx: sql`CREATE INDEX IF NOT EXISTS majors_title_search_idx ON ${table} USING gin (to_tsvector('english', title))`
  }
});

const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  departmentCode: varchar('department_code', { length: 255 }).notNull().unique(),
  description: text('description'),
  headFacultyId: integer('head_faculty_id').references(() => faculty.id),
}, (table) => {
  return {
    nameIdx: sql`CREATE INDEX IF NOT EXISTS departments_name_search_idx ON ${table} USING gin (to_tsvector('english', name))`,
    descriptionIdx: sql`CREATE INDEX IF NOT EXISTS departments_description_search_idx ON ${table} USING gin (to_tsvector('english', description))`
  }
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
}, (table) => {
  return {
    emailIdx: sql`CREATE INDEX IF NOT EXISTS users_email_idx ON ${table} USING gin (to_tsvector('english', email))`,
    usernameIdx: sql`CREATE INDEX IF NOT EXISTS users_username_idx ON ${table} USING gin (to_tsvector('english', username))`
  }
});

const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  majorId: integer('major_id').references(() => majors.id).notNull(),
  minorId: integer('minor_id').references(() => majors.id),
  userId: integer('user_id').references(() => users.id).notNull(),
  GPA: real('gpa').notNull().default(0.0)
}, (table) => {
  return {
    nameIdx: sql`CREATE INDEX IF NOT EXISTS students_name_search_idx ON ${table} USING gin (to_tsvector('english', name))`,
    addressIdx: sql`CREATE INDEX IF NOT EXISTS students_address_search_idx ON ${table} USING gin (to_tsvector('english', address))`,

  }
});

const studentNotes = pgTable('student_notes', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  note: text('note'),
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => {
  return {
    noteIdx: sql`CREATE INDEX IF NOT EXISTS student_notes_note_idx ON ${table} USING gin (to_tsvector('english', note))`
  }
});

const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  positionTitle: varchar('position_title', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  officeNumber: varchar('office_number', { length: 50 }),
  mainDepartment: integer('main_department_id').references(() => departments.id),
  userId: integer('user_id').references(() => users.id).notNull()
}, (table) => {
  return {
    nameIdx: sql`CREATE INDEX IF NOT EXISTS faculty_name_search_idx ON ${table} USING gin (to_tsvector('english', name))`,
    positionTitleIdx: sql`CREATE INDEX IF NOT EXISTS faculty_position_title_search_idx ON ${table} USING gin (to_tsvector('english', position_title))`
  }
});

const scheduledCourses = pgTable('scheduled_courses', {
  id: serial('id').primaryKey(),
  //scheduleNumber: varchar('schedule_number', { length: 20 }).notNull().unique(),
  instructorId: integer('instructor_id').references(() => faculty.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  seats: integer('seats').notNull().default(0),
  availableSeats: integer('available_seats').notNull().default(0),
  semester: semesterEnum('semester').notNull(),
  year: integer('year').notNull(),
  scheduleNumber: varchar('schedule_number', { length: 20 }).notNull()
}, (table) => {
  return {
    instructorIdx: sql`CREATE INDEX IF NOT EXISTS scheduled_courses_instructor_id_idx ON ${table} (instructor_id)`
  }
});

const courses  = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  description: text('description'),
  units: integer('units').notNull(),
  departmentId: integer('department_id').references(() => departments.id),
  isGraduateLevel: boolean('is_graduate_level').notNull().default(false)
}, (table) => {
  return {
    titleIdx: sql`CREATE INDEX IF NOT EXISTS courses_title_search_idx ON ${table} USING gin (to_tsvector('english', title))`
  }
});

const transferCredits = pgTable('transfer_credits', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  studentId: integer('student_id').references(() => students.id),
  universityName: varchar('university_name', { length: 255 }).notNull(),
  universityLocation: varchar('university_location', { length: 255 }).notNull(),
  originalCourseCode: varchar('original_course_code', { length: 255 }).notNull(),
  grade: varchar('grade', { length: 2 }).notNull(),
  semester: semesterEnum('semester').notNull(),
  year: integer('year').notNull()
});

// relations

const transferCreditsRelations = relations(transferCredits, ({ one }) => ({
  course: one(courses, {
    fields: [transferCredits.courseId],
    references: [courses.id]
  }),
  student: one(students, {
    fields: [transferCredits.studentId],
    references: [students.id]
  })  
}));

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

const courseMajors = pgTable('course_majors', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  majorId: integer('major_id').references(() => majors.id)
});

const courseMajorsRelations = relations(courseMajors, ({ one }) => ({
  course: one(courses, {
    fields: [courseMajors.courseId],
    references: [courses.id]
  }),
  major: one(majors, {
    fields: [courseMajors.majorId],
    references: [majors.id]
  })

}));

const majorRelations = relations(majors, ({ many, one }) => ({
  studentsWithMajor: many(students, { relationName: "studentMajor" }),
  studentsWithMinor: many(students, { relationName: "studentMinor" }),
  majorFaculty: many(majorFaculty),
  courseMajors: many(courseMajors),
  majorRequirements: many(majorRequirements),
  department: one(departments, {
    fields: [majors.departmentId],
    references: [departments.id]
  })
}));

const courseRelations = relations(courses, ({ many, one }) => ({
  prerequisites: many(coursePrerequisites, { relationName: 'coursePrerequisites' }),
  prerequisiteFor: many(coursePrerequisites, { relationName: 'prerequisiteForCourses' }),
  scheduledCourses: many(scheduledCourses),
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id]
  }),
  courseMajors: many(courseMajors),
  courseQualifiedFaculty: many(courseQualifiedFaculty),
  majorRequirements: many(majorRequirements)
}));

const coursePrerequisites = pgTable('course_prerequisites', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  prerequisiteId: integer('prerequisite_id').references(() => courses.id)
});

const coursePrerequisitesRelations = relations(coursePrerequisites, ({ one }) => ({
  course: one(courses, {
    fields: [coursePrerequisites.courseId],
    references: [courses.id],
    relationName: 'coursePrerequisites'
  }),
  prerequisite: one(courses, {
    fields: [coursePrerequisites.prerequisiteId],
    references: [courses.id],
    relationName: 'prerequisiteForCourses'
  })
}));

const majorFaculty = pgTable('major_faculty', {
  id: serial('id').primaryKey(),
  majorId: integer('major_id').references(() => majors.id),
  facultyId: integer('faculty_id').references(() => faculty.id)
});

const majorFacultyRelations = relations(majorFaculty, ({ one }) => ({
  major: one(majors, {
    fields: [majorFaculty.majorId],
    references: [majors.id]
  }),
  faculty: one(faculty, {
    fields: [majorFaculty.facultyId],
    references: [faculty.id]
  })
}));

const courseQualifiedFaculty = pgTable('course_qualified_faculty', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  facultyId: integer('faculty_id').references(() => faculty.id)
});

const facultyRelations = relations(faculty, ({ one }) => ({
  user: one(users, {
    fields: [faculty.userId],
    references: [users.id]
  }),
  mainDepartment: one(departments, {
    fields: [faculty.mainDepartment],
    references: [departments.id]
  })

}));

const courseQualifiedFacultyRelations = relations(courseQualifiedFaculty, ({ one }) => ({
  course: one(courses, {
    fields: [courseQualifiedFaculty.courseId],
    references: [courses.id]
  }),
  faculty: one(faculty, {
    fields: [courseQualifiedFaculty.facultyId],
    references: [faculty.id]
  })
}));

const studentScheduledCourses = pgTable('student_scheduled_courses', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  scheduledCourseId: integer('scheduled_course_id').references(() => scheduledCourses.id),
  grade: varchar('grade', { length: 2 }),
  isCompleted: boolean('is_completed').notNull().default(false),
  enrollmentDate: timestamp('enrollment_date').notNull().defaultNow()

});

const studentScheduledCoursesRelations = relations(studentScheduledCourses, ({ one }) => ({
  student: one(students, {
    fields: [studentScheduledCourses.studentId],
    references: [students.id]
  }),
  scheduledCourse: one(scheduledCourses, {
    fields: [studentScheduledCourses.scheduledCourseId],
    references: [scheduledCourses.id]
  })
}));

const scheduledCourseRelations = relations(scheduledCourses, ({ many, one }) => ({
  instructor: one(faculty, {
    fields: [scheduledCourses.instructorId],
    references: [faculty.id]
  }),
  course: one(courses, {
    fields: [scheduledCourses.courseId],
    references: [courses.id]
  }),
  studentScheduledCourses: many(studentScheduledCourses)

}));

const departmentRelations = relations(departments, ({ one }) => ({
  headFaculty: one(faculty, {
    fields: [departments.headFacultyId],
    references: [faculty.id]
  })
}));

const facultyDepartmentsInvolvedIn = pgTable('faculty_departments_involved_in', {
  id: serial('id').primaryKey(),
  facultyId: integer('faculty_id').references(() => faculty.id),
  departmentId: integer('department_id').references(() => departments.id)
});

const facultyDepartmentsInvolvedInRelations = relations(facultyDepartmentsInvolvedIn, ({ one }) => ({
  faculty: one(faculty, {
    fields: [facultyDepartmentsInvolvedIn.facultyId],
    references: [faculty.id]
  }),
  department: one(departments, {
    fields: [facultyDepartmentsInvolvedIn.departmentId],
    references: [departments.id]
  })
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

const studentRelations = relations(students, ({ one, many }) => ({
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
  }),
  studentScheduledCourses: many(studentScheduledCourses)

}));

const studentNotesRelations = relations(studentNotes, ({ one }) => ({
  student: one(students, {
    fields: [studentNotes.studentId],
    references: [students.id]
  })
}));

const majorRequirements = pgTable('major_requirements', {
  id: serial('id').primaryKey(),
  majorId: integer('major_id').references(() => majors.id),
  courseId: integer('course_id').references(() => courses.id),
  isRequired: boolean('is_required').notNull().default(false),
  isElective: boolean('is_elective').notNull().default(false)
});

const majorRequirementsRelations = relations(majorRequirements, ({ one }) => ({
  major: one(majors, {
    fields: [majorRequirements.majorId],
    references: [majors.id]
  }),
  course: one(courses, {
    fields: [majorRequirements.courseId],
    references: [courses.id]
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
    dateRelations,
    courseMajors,
    majorFaculty,
    majorFacultyRelations,
    courseMajorsRelations,
    courseQualifiedFaculty,
    courseQualifiedFacultyRelations,
    coursePrerequisites,
    coursePrerequisitesRelations, 
    facultyDepartmentsInvolvedIn,
    facultyDepartmentsInvolvedInRelations,
    studentScheduledCourses,
    studentScheduledCoursesRelations,
    majorRequirements,
    majorRequirementsRelations,
    studentNotes,
    studentNotesRelations,
    transferCredits,
    transferCreditsRelations,
    semesterEnum


};
