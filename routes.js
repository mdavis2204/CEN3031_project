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

// Takes username, date range in Date() format, and sitting/service level. Returns true if time is added, false if not
router.post('/addTime', async (req, res) => {
  const { userName, startDate, endDate, serviceLevel } = req.body;

  try {
      // Validate input
      if (new Date(startDate) >= new Date(endDate)) {
          return false;
      }

      // Find user
      const user = await User.findOne({ userName });
      if (!user) {
          return false;
      }

      // Add new time range
      user.timeRanges.push({ startDate, endDate, serviceLevel });
      await user.save();

      return true;
      
  } catch (error) {
      console.error('Error adding time range:', error);
      return false;
  }
});

// Takes in username and date index from getTimes, returns true if time is successfully removed, false if not
router.post('/removeTime', async (req, res) => {
  const { userName, timeRangeId } = req.body;

  try {
      const user = await User.findOne({ userName });
      if (!user) {
          return false;
      }

      user.timeRanges = user.timeRanges.filter((range) => range._id.toString() !== timeRangeId);
      await user.save();

      return true;

  } catch (error) {
      console.error('Error removing time range:', error);
      return false;
  }
});

// Takes in username, returns a list of timeRanges or errors if user does not exist
router.get('/getTimes', async (req, res) => {
  const { userName } = req.query;

  try {
      const user = await User.findOne({ userName });
      if (!user) {
          return res.status(404).json({ error: 'User not found' }); // Found out that I could do this, may update future
      }

      return res.status(200).json({ timeRanges: user.timeRanges });
  } catch (error) {
      console.error('Error listing time ranges:', error);
      return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router