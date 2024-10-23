# Overview of API functions grouped by functionality

## User Table
### User Authentication
- login(username, password)
    - Get request?
    - Returns an authentication token
- TODO: LATER ON WE WILL NEED DIFFERENT LEVELS OF AUTHENTICATION

### Regular Functions
- get_all_users()
    - Get request
    - Returns all users in the table
- get_user(ID)
    - Get request
    - returns JSON blob with all data for the specified user
- create_user(user_data)
    - Post request
    - Input is a JSON blob containing all of the data required to create a new user
    - Returns confirmation
- TODO: Add new function similar to create user?
- edit_user(ID, user_data)
    - Put request
    - Input is a JSON blob containing all of the new data for that user entry
    - Returns confirmation
- delete_user(ID)
    - Get request
    - Returns confirmation

## Faculty Table
- get_all_faculty()
    - Get request
    - Returns all faculty in the table
- get_faculty(ID)
    - Get request
    - Returns JSON blob with all faculty data
- create_faculty(faculty_data)
    - Post request
    - Input is a JSON blob containing all of the data required to create a new faculty
    - Returns confirmation
- edit_faculty(faculty_data)
    - Put request
    - Input is a JSON blob containing all of the new data for that faculty entry
    - Returns confirmation
- delete_faculty(ID)
    - Get request
    - Returns confirmation

## Student Table
- get_all_students()
    - Get request
    - Returns all students in the table
- get_student(ID)
    - Get request
    - Returns JSON blob with all student data
- create_student(student_data)
    - Post request
    - Later on this will require faculty privileges
    - Input is a JSON blob containing all of the data required to create a new student
    - Returns confirmation
- edit_student(student_data)
    - Put request
    - This is going to be the catch-all function to update specific user data, instead of having specific functions to add classes, change address,etc.
    - Input is a JSON blob containing all of the new data for that student entry
    - Returns confirmation
- delete_student(ID)
    - Get request
    - Returns confirmation

## Major Table
- get_all_majors()
    - Get request
    - Returns all majors in the table
- get_multiple_majors(array of IDs)
    - Get request
    - This function allows the user to look at multiple majors at once
    - Returns multiple major objects specified by ID
- get_major(ID)
    - Get request
    - Returns JSON blob with all major data
- create_major(major_data)
    - Post request
    - Later on this will require faculty privileges
    - Input is a JSON blob containing all of the data required to create a new major
    - Returns confirmation
- edit_major(major_data)
    - Put request
    - Input is a JSON blob containing all of the new data for that major entry
    - Returns confirmation
- delete_major(ID)
    - Get request
    - Returns confirmation

## Course Table
- get_all_courses()
    - Get request
    - Returns all courses in the table
- get_multiple_courses(array of IDs)
    - Get request
    - This function allows the user to look at multiple courses at once
    - Returns multiple course objects specified by ID
- get_all_major_courses(Major)
    - Get request
    - This function allows the user to get all of the required courses for the specified major
    - Returns all of the RequiredCourses entries for the specified Major
- get_course(ID)
    - Get request
    - Returns JSON blob with all course data
- create_course(course_data)
    - Post request
    - Later on this will require faculty privileges
    - Input is a JSON blob containing all of the data required to create a new course
    - Returns confirmation
- edit_course(course_data)
    - Put request
    - Input is a JSON blob containing all of the new data for that course entry
    - Returns confirmation
- delete_course(ID)
    - Get request
    - Returns confirmation

## Scheduled Course Table
- get_all_scheduled_courses()
    - Get request
    - Returns all scheduled_courses in the table
- get_scheduled_course(ID)
    - Get request
    - Returns JSON blob with all scheduled_course data
- create_scheduled_course(scheduled_course_data)
    - Post request
    - This function must check that the new course doesn't conflict with any existing courses for the current user, and if it does, it must return an error
    - Input is a JSON blob containing all of the data required to create a new scheduled_course
    - Returns confirmation
- edit_scheduled_course(scheduled_course_data)
    - Put request
    - Input is a JSON blob containing all of the new data for that scheduled_course entry
    - Returns confirmation
- delete_scheduled_course(ID)
    - Get request
    - Returns confirmation
