const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user has password (not Google OAuth user)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please use Google OAuth to login'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          preferences: user.preferences
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered with password. Please login with password.'
        });
      }

      // Create new user
      user = new User({
        googleId,
        email,
        username: name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        avatar: picture,
        password: undefined // Ensure no password for Google users
      });

      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          preferences: user.preferences
        },
        token
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          isAdmin: user.isAdmin,
          preferences: user.preferences,
          stats: user.stats,
          followers: user.followers.length,
          following: user.following.length
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

module.exports = router; 