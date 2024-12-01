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

router.get('/swipe_page', (req, res) => {
    res.sendFile(root + '/views/swipe_page.html');
});

//login attempt
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  try {
      // Find user by username
      const user = await User.findOne({ userName });
      if (!user) {
          console.log("Username not found.");
          return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PawSwipe</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <h1>PawSwipe</h1>
                <div class="center">
                    <div class="userReg">
                        <h2>User Login:</h2> 
                        <form action="/login" method="POST">
                            <label for="userName">Username:</label><br>
                            <input type="text" id="userName" name="userName" required><br>
                            <label for="password">Password:</label><br>
                            <input type="password" id="password" name="password" required><br><br>
                            <input type="submit" value="Enter">
                        </form>
                        <p style="color: red;">Username not found.</p>
                    </div>
                    <div class="dogImage">
                        <img src="image/dog.jpg" alt="Dog Image">
                    </div>
                </div>
            </body>
            </html>
        `);
      }

      // Compare the provided password with the stored password
      if (user.password !== password) {
          console.log("Incorrect password.");
          return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PawSwipe</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <h1>PawSwipe</h1>
                <div class="center">
                    <div class="userReg">
                        <h2>User Login:</h2> 
                        <form action="/login" method="POST">
                            <label for="userName">Username:</label><br>
                            <input type="text" id="userName" name="userName" required><br>
                            <label for="password">Password:</label><br>
                            <input type="password" id="password" name="password" required><br><br>
                            <input type="submit" value="Enter">
                        </form>
                        <p style="color: red;">Incorrect password.</p>
                    </div>
                    <div class="dogImage">
                        <img src="image/dog.jpg" alt="Dog Image">
                    </div>
                </div>
            </body>
            </html>
        `);
      }

      console.log("Login successful!");
      //return res.json({ message: 'Login successful' });
      req.session.user = userName;
      return res.sendFile(root + '/views/swipe_page.html');
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
  res.sendFile(root + '/views/home.html')
})

//Setup -> login
router.post('/setup', (req, res) => {
    res.sendFile(root + '/views/home.html')
  })

//register attempt
router.post('/register', async(req, res) => {
    const { userName, password } = req.body;
    const setupComplete = false;
    console.log(req.body)

    try {
      // check irf user with username already exists
      const existingUser = await User.findOne({ userName });
      
      //Message if the user already exists
      if (existingUser) {
        console.log("User with this name already exists.");
                    return res.status(400).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PawSwipe</title>
                    <link rel="stylesheet" href="style.css">
                </head>
                <body>
                    <h1>PawSwipe</h1> 
                    <div class="center">
                        <div class="userReg">
                            <h2>User Registration:</h2> 
                            <form action="/register" method="POST">
                                <!-- userName field -->
                                <label for="userName">Username:</label><br>
                                <input type="text" id="userName" name="userName" required><br>

                                <!-- password field -->
                                <label for="password">Password:</label><br>
                                <input type="password" id="password" name="password" required><br><br>

                                <input type="submit" value="Enter">
                            </form>
                            <p style="color: red;">User with this name already exists.</p>
                        </div>
                        <div class="dogImage">
                            <img src="image/dog.jpg" alt="Dog Image">
                        </div>
                    </div>
                </body>
                </html>
            `);
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

router.get('/getUserInfo', (req, res) => {
    if (req.session && req.session.user) {
      res.json({ userName: req.session.user });
    } else {
      res.status(401).json({ error: 'User not logged in' });
    }
  });

  router.get('/messaging', (req, res) => {
    if (!req.session.user) {
        // Redirect to login if user is not logged in
        return res.redirect('/login');
    }
    res.sendFile(root + '/views/messaging.html');
});
module.exports = router