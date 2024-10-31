const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware')
const { db } = require('./db')

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'UPDATE', 'DELETE', 'PATCH', 'OPTIONS', 'PUT']
}))
app.listen(process.env.PORT, () => {
    console.log("App started on port " + process.env.PORT)
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/majors', require('./routes/majorRoutes'))
app.use('/api/students', require('./routes/studentRoutes'))
app.use('/api/faculty', require('./routes/facultyRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/scheduledcourses', require('./routes/scheduledCourseRoutes'))
app.use('/api/departments', require('./routes/departmentRoutes'))
app.use('/api/studentnotes', require('./routes/studentNoteRoutes'))
app.use('/api/transfercredits', require('./routes/transferCreditRoutes'))
app.use('/api/dates', require('./routes/dateRoutes'))


app.use(errorHandler)

module.exports = { db };

// if(process.env.NODE_ENV === 'production'){
    //     app.use(express.static('frontend/build'))
// }