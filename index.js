const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

const movies = [
  {
    title: 'My Fair Lady',
    year: 1964,
    director: 'George Cukor',
    genre: 'Musical',
  },
  {
    title: 'Gone With The Wind',
    year: 1939,
    director: 'Victor Fleming',
    genre: 'Drama',
  },
  {
    title: 'Memoirs of a Geisha',
    year: 2005,
    director: 'Rbo Marshall',
    genre: 'Drama',
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    director: 'Robert Zemeckis',
    genre: 'Drama',
  },
  {
    title: 'Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    genre: 'Drama',
  },
  {
    title: 'The Godfather',
    year: 1972,
    director: 'Francis Ford Coppola',
    genre: 'Drama',
  },
  {
    title: 'Goodfellas',
    year: 1990,
    director: 'Martin Scorsese',
    genre: 'Drama',
  },
  {
    title: "Breakfast at Tiffany's",
    year: 1961,
    director: 'Blake Edwards',
    genre: 'Romance',
  },
  {
    title: 'The Notebook',
    year: 2004,
    director: 'Nick Cassavetes',
    genre: 'Romance',
  },
  {
    title: 'Miracle on 34th Street',
    year: 1947,
    director: 'George Seaton',
    genre: 'Family',
  },
];

app.use(morgan('combined', { stream: accessLogStream }));

// READ
app.get('/movies', (req, res) => {
  res.status(200).send('Successful GET request returning data on all movies');
});

// READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((m) => m.title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to my Movie API!');
});

app.get('/movies/genres/{genreName}', (req, res) => {
  res.send(
    'Successful GET request returning data on a movies with the corresponding genre',
  );
});

app.get('/movies/directors/{directorName}', (req, res) => {
  res.send(
    'Successful GET request returning data on movies by the corresponding director',
  );
});

app.post('/login', (req, res) => {
  const newUser = req.body;
  newUser.id = uuid.v4();
  res.send('Successful POST request returning an authentication token');
});

app.post('/users', (req, res) => {
  res
    .status(200)
    .send('Successful POST request returning a confirmation message');
});

app.put('/users/:username', (req, res) => {
  res
    .status(200)
    .send('Successful PUT request returning a confirmation message');
});

app.delete('/users/:username', (req, res) => {
  res
    .status(200)
    .send('Successful DELETE request returning a confirmation message');
});

app.put('/users/:username/movies/:movieID', (req, res) => {
  res
    .status(200)
    .send('Successful PUT request returning a confirmation message');
});

app.delete('/users/:username/movies/:movieID', (req, res) => {
  res
    .status(200)
    .send('Successful DELETE request returning a confirmation message');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Your movie app is listening on port 8080');
});
