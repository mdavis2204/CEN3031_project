const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/routes')
require('dotenv').config()

//express app
const app = express()

//middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use(express.json())
app.use(express.static('public'))

//routes
app.use('/', routes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //listen
    app.listen(process.env.PORT, () =>{
    console.log('connected to db and listening on port', process.env.PORT)
})
})
.catch((error) => {
    console.log(error)
})



