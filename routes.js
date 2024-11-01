const express = require('express')

const path = require('path')

const router = express.Router()
let root = path.join(__dirname, './')


const User = require(root + '/models/accounts.js')

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
router.post('/register', async(req, res) => {
    const { userName, password } = req.body;
    console.log(req.body)

    try {
      // check irf user with username already exists
      const existingUser = await User.findOne({ userName });
      
      if (existingUser) {
        console.log("User with this name already exists.");
        return res.status(400).json({ error: 'User with this name already exists' });
      }
  
      // make new user if no match found
      const newUser = new User({ userName, password });
      await newUser.save();
  
      console.log("New user created successfully.");
      return res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    }
})


module.exports = router