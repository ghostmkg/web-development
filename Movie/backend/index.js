const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { ensureAuthenticated } = require('./middlewares/authMiddleware');
const User = require('./models/user'); // Assuming you have User model in models directory

const app = express();
const port = 5002;
const config = { secret: 'edurekaSecret' };

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movieapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route to get movies data from db.json
app.get('/api/movies', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read db.json' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Route to get trailer data from db2.json
app.get('/api/movies/trailers', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db2.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read db2.json' });
      return;
    }

    const jsonData = JSON.parse(data);
    if (jsonData.trailers) {
      res.json({ trailers: jsonData.trailers });
    } else {
      res.status(404).json({ error: 'No trailers found' });
    }
  });
});

// Route to get upcoming movies from TMDb
app.get('/api/upcomingmovies', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
      params: {
        api_key: '4e44d9029b1270a757cddc766a1bcb63',
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from TMDb' });
  }
});

// Route to get specific movie details by ID
app.get('/api/upcomingmovies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: '4e44d9029b1270a757cddc766a1bcb63',
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching movie with ID ${movieId}:`, error.message);
    res.status(404).json({ error: `Movie with ID ${movieId} not found` });
  }
});

// Route to fetch events data from db3.json
app.get('/api/events', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'db3.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db3.json:', err.message);
      res.status(500).json({ error: 'Failed to read events data' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Registration route with validation
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// Serve the React app in production
/*
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
*/

// Logout route
app.post('/api/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('authToken'); // Adjust the cookie name if needed

  res.json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
