require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const axios = require('axios');
const { user, book, favorite } = require('./models');


// Environment variables
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


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

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Route for explore page
app.get('/explore', isLoggedIn, (req, res) => {
  res.render('explore', { books: [], search: '' });
});

// bookSearch
app.get('/bookSearch/:genre/:title', function (req, res) {
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=genre:${encodeURIComponent(req.params.genre)}+intitle:${encodeURIComponent(req.params.title)}&maxResults=1&key=${API_KEY}`)
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
app.post('/bookSearch', isLoggedIn, (req, res) => {
  const { genre, author, title, category, isbn } = req.body;

  let query = '';

  if (genre) {
    query += `genre:${genre} `;
  }

  if (author) {
    query += `inauthor:${author} `;
  }

  if (title) {
    query += `intitle:${title} `;
  }

  if (category) {
    query += `category:${category} `;
  }

  if (isbn) {
    query += `isbn:${isbn} `;
  }

  const maxResults = 40; // number of books to fetch

  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`)
    .then(function (response) {
      if (response.data.items && response.data.items.length > 0) {
        const books = response.data.items.map(item => item);
        // console.log('Search Results:', books);

        let filteredBooks;

        if (req.body.searchType === 'author') {
          filteredBooks = books.filter(book => book.volumeInfo.authors && book.volumeInfo.authors.join(', ').toLowerCase().includes(req.body.search.toLowerCase()));
        } else if (req.body.searchType === 'title') {
          filteredBooks = books.filter(book => book.volumeInfo.title && book.volumeInfo.title.toLowerCase().includes(req.body.search.toLowerCase()));
        } else if (req.body.searchType === 'category') {
          filteredBooks = books.filter(book => book.volumeInfo.categories && book.volumeInfo.categories.join(', ').toLowerCase().includes(req.body.search.toLowerCase()));
        } else if (req.body.searchType === 'isbn') {
          filteredBooks = books.filter(book => book.volumeInfo.industryIdentifiers && book.volumeInfo.industryIdentifiers.some(identifier => identifier.identifier.toLowerCase().includes(req.body.search.toLowerCase())));
        } else {
          filteredBooks = books;
        }
        console.log('FILTERED BOOKS', filteredBooks);
        res.render('search', { books: filteredBooks, search: query });
      } else {
        console.log('No books found.');
        res.render('search', { books: [], search: query });
      }
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('search', { books: [], search: query });
    });
});

// Add book to favorites
app.post('/favorites/add', async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  console.log('BOOK ID!!!!!!', bookId);
  try {
    const fav = await favorite.findOne({
      where: {
        userId: userId,
        bookId: bookId
      }
    });

    if (fav) {

    } else {
      await favorite.create({
        userId: userId,
        bookId: bookId
      });
    }
  } catch (error) {
    console.error('Error adding book to favorites:', error);
  }

  res.redirect('/favorites');
});


// DELETE route for favorites
app.delete('/favorites/:id', async (req, res) => {
  const favoriteId = req.params.id;

  try {
    await favorite.destroy({ where: { bookId: favoriteId } });
    res.redirect('/favorites');
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.redirect('/favorites');
  }
});


// Favorites page route
app.get('/favorites', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const userFavorites = await favorite.findAll({
      where: {
        userId: userId
      }
    });

    console.log('USER FAVORITES:', userFavorites);
    const favoriteBooks = [];

    for (const userFavorite of userFavorites) {
      try {
        const bookId = userFavorite.bookId;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`);
        favoriteBooks.push(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    }

    res.render('favorites', { books: favoriteBooks });

  } catch (error) {
    console.error('Error retrieving user favorites:', error);
    res.render('no-results', { books: [] });
  }
});

// Route for adventure page
app.get('/adventure', isLoggedIn, (req, res) => {
  const genre = 'adventure';
  const maxResults = 40; // number of books to fetch

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    .then(function (response) {
      const books = response.data.items;
      res.render('adventure', { genre, books });
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('no-results');
    });
});


// Route for fantasy genre
app.get('/fantasy', isLoggedIn, (req, res) => {
  const genre = 'fantasy';
  const maxResults = 40; // number of books to fetch

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    .then(function (response) {
      const books = response.data.items;
      res.render('fantasy', { genre, books });
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('no-results');
    });
});

// Route for mystery genre
app.get('/mystery', isLoggedIn, (req, res) => {
  const genre = 'mystery';
  const maxResults = 40; // number of books to fetch

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    .then(function (response) {
      const books = response.data.items;
      res.render('mystery', { genre, books });
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('no-results');
    });
});

// Route for romance genre
app.get('/romance', isLoggedIn, (req, res) => {
  const genre = 'romance';
  const maxResults = 40; // number of books to fetch

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    .then(function (response) {
      const books = response.data.items;
      res.render('romance', { genre, books });
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('no-results');
    });
});

// Route for sciencefiction genre
app.get('/science-fiction', isLoggedIn, (req, res) => {
  const genre = 'science-fiction';
  const maxResults = 40; // number of books to fetch

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    .then(function (response) {
      const books = response.data.items;
      res.render('science-fiction', { genre, books });
    })
    .catch(function (error) {
      console.log('Error fetching data:', error);
      res.render('no-results');
    });
});


// Route for Thriller genre
app.get('/thriller', isLoggedIn, (req, res) => {
  res.render('thriller');
});

// Search page route
app.get('/search', isLoggedIn, (req, res) => {
  res.render('search', { books: [] });
});

app.use('/auth', require('./controllers/auth'));

app.get('/profile', isLoggedIn, async (req, res) => {
  const { id, name, email } = req.user;
  res.render('profile', { id, name, email });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
