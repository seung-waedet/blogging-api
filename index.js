const express = require('express')
const app = express()
const db = require('./db')
const passport = require('passport')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const os = require('os')
const PORT = process.env.PORT || 3000

//CONNECT TO MONGOOSE
if (process.env.NODE_ENV != "test") {
    db.connectToDb()
}


//Signup and login authentication middleware
require('./authentication/auth')

//To parse url encoded data
app.use(express.urlencoded( {extended: false} ))

//To parse data passed via body
app.use(express.json())


//USER ROUTE
app.use('/api', userRoute)

//BLOG ROUTE
app.use('/api/blog', blogRoute)

app.get('/', (req, res) => {
    res.status(200).json({status: true, message: `Welcome to Annies Blog API`})
})


//Error Middleware function
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    
    //send the first line of an error message 
    if (err instanceof Error) return res.json({error: err.message.split(os.EOL)[0]})

    res.json({ error: err.message });
})

app.use('*', (req, res) => {
    res.status(404).json({status: false, message: `Route not found`})
})

if (process.env.NODE_ENV != "test") {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT http://localhost:${PORT}`)
    })
}

module.exports = app