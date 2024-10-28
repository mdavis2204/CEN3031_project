const express = require('express')
const path = require('path')

const router = express.Router()
let root = path.join(__dirname, '../')

//home screen
router.get('/', (req, res) => {
    res.sendFile(root + '/views/home.html')
})

//home->login
router.get('/login', (req, res) => {
    res.sendFile(root + '/views/login.html')
})

//login attempt
router.post('/login', (req, res) => {
    res.sendFile(root + '/views/login.html')
    res.json({mssg: 'login attempt'})
})

//home->register
router.get('/register', (req, res) => {
    res.sendFile(root + '/views/register.html')
})

//register attempt
router.post('/register', (req, res) => {
    res.json({mssg: 'register attempt'})
    const {username, password} = req.body
    console.log(username, password)
    console.log(req.body)
})


module.exports = router