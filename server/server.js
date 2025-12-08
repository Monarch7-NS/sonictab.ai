const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Tab = require('./models/Tab');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tabsense', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Middleware: Verify Token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

// --- ROUTES ---

// @route   POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { id: user.id, isAdmin: user.isAdmin };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { id: user.id, isAdmin: user.isAdmin };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tabs
// @desc    Get user's tabs
app.get('/api/tabs', auth, async (req, res) => {
  try {
    const tabs = await Tab.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tabs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tabs
// @desc    Save a new tab
app.post('/api/tabs', auth, async (req, res) => {
  const { title, artist, tuning, bpm, content } = req.body;
  try {
    const newTab = new Tab({
      user: req.user.id,
      title,
      artist,
      tuning,
      bpm,
      content
    });
    const tab = await newTab.save();
    res.json(tab);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tabs/:id
app.delete('/api/tabs/:id', auth, async (req, res) => {
  try {
    const tab = await Tab.findById(req.params.id);
    if (!tab) return res.status(404).json({ msg: 'Tab not found' });
    if (tab.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await tab.deleteOne();
    res.json({ msg: 'Tab removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
