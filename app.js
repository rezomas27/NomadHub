const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const placeRoutes = require('./routes/placeRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

// Express app
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json()); // Ensure you can parse JSON bodies

app.use(session({
  secret: '745287',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');


// Routes
app.use('/posts', placeRoutes);
app.use('/posts', postRoutes);
app.use('/', userRoutes);

// Redirects
app.get('/about-us', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Route for 'About' page
app.get('/about', (req, res) => {
  res.render('noaccess/about', { title: 'About' });
});

// Route for Home page
app.get('/', (req, res) => {
  res.render('noaccess/index', { title: 'Home Page' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Connect to MongoDB and start server
const dbURI = process.env.MONGODB_URI || "mongodb+srv://sammymozer:Snickers_27@cluster0.ssmpkvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI)
  .then(result => {
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
