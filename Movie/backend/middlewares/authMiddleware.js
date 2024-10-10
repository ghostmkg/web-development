const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model
const config = { secret: 'edurekaSecret' }; // Or import this from a config file

const ensureAuthenticated = async (req, res, next) => {
  const token = req.cookies.authToken || req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.secret);

    // Fetch the user from the database using the ID from the token
    const user = await User.findById(decoded.id);

    // If user is not found, send an error response
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Attach user data to request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Token is not valid, authorization denied' });
  }
};

module.exports = {
  ensureAuthenticated
};
