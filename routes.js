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
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  try {
      // Find user by username
      const user = await User.findOne({ userName });
      if (!user) {
          console.log("Username not found.");
          return res.status(404).json({ error: 'Username not found' });
      }

      // Compare the provided password with the stored password
      if (user.password !== password) {
          console.log("Incorrect password.");
          return res.status(401).json({ error: 'Incorrect password' });
      }

      console.log("Login successful!");
      return res.json({ message: 'Login successful' });
  } catch (error) {
      console.error("Error occurred during login:", error);
      res.status(500).json({ error: 'An error occurred during login' });
  }
})

//home->register
router.get('/register', (req, res) => {
    res.sendFile(root + '/views/register.html')
})

//setup
router.get('/setup', (req, res) => {
  res.sendFile(root + '/views/setup.html')
})

//register attempt
router.post('/register', async(req, res) => {
    const { userName, password } = req.body;
    const setupComplete = false;
    console.log(req.body)

    try {
      // check irf user with username already exists
      const existingUser = await User.findOne({ userName });
      
      if (existingUser) {
        console.log("User with this name already exists.");
        return res.status(400).json({ error: 'User with this name already exists' });
      }
  
      // make new user if no match found
      const newUser = new User({ userName, password, setupComplete });
      await newUser.save();
  
      console.log("New user created successfully.");
      return res.sendFile(root + '/views/setup.html')
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    }
})


module.exports = router