require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const axios = require('axios');

// Environment variables
SECRET_SESSION = process.env.SECRET_SESSION;

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.use(flash());
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/explore', isLoggedIn, (req, res) => {
  res.render('explore', { books: [], search: '' });
});


app.get('/explore/:genre/:title', function (req, res) {
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=genre:${encodeURIComponent(req.params.genre)}&q=intitle:${encodeURIComponent(req.params.title)}&maxResults=1`)
    .then(function (response) {
      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0].volumeInfo;
        res.render('single-book', { book });
      } else {
        console.log('Book not found.');
        res.json({ message: 'Book not found.' });
      }
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.json({ message: 'Data not found. Please try again later.' });
    });
});

// POST route for book search
app.post('/explore', isLoggedIn, (req, res) => {
  const { genre, title } = req.body;
  const query = `genre:${genre} intitle:${title}`;

  console.log('Search Query:', query);

  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`)
    .then(function (response) {
      if (response.data.items && response.data.items.length > 0) {
        const books = response.data.items.map(item => item.volumeInfo);
        console.log('Search Results:', books);
        res.render('explore', { books, search: query });
      } else {
        console.log('No books found.');
        res.render('explore', { books: [], search: query });
      }
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('explore', { books: [], search: query });
    });
});


app.use('/auth', require('./controllers/auth'));

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  res.render('profile', { id, name, email });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
