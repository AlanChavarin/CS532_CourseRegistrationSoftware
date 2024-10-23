# Overview of API functions grouped by functionality

## User Table
### User Authentication
- login(username, password)
    - Get request?
    - Returns an authentication token
- LATER ON WE WILL NEED DIFFERENT LEVELS OF AUTHENTICATION

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
