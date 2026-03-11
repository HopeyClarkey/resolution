const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { Users } = require('../database/index');
const { isUserAuthenticated } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    console.log('Verifying token with Client ID:', process.env.GOOGLE_CLIENT_ID);
  
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const profile = ticket.getPayload();
    const { sub: googleId, email, name, picture } = profile;
    console.log('Token verified for user:', email);

    
    try {
      const [user] = await Users.findOrCreate({
        where: { googleId },
        defaults: { username: name, email, picture, googleId }
      });
      
      console.log('User found or created in DB:', user.id);

      req.session.userId = user.id;
      
      res.send('Signed In!');
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      res.status(500).send('Database error');
    }

  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).send('Invalid token: ' + error.message);
  }
});

router.get('/test', isUserAuthenticated, (req, res) => {
  res.send('Authenticated!');
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid');
    res.send('Logged Out!');
  });
});

module.exports = router;
