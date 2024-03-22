const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

const topTen = [
  {
    title: 'My Fair Lady',
    year: 1964,
  },
  {
    title: 'Gone With The Wind',
    year: 1939,
  },
  {
    title: 'Memoirs of a Geisha',
    year: 2005,
  },
  {
    title: 'Forrest Gump',
    year: 1994,
  },
  {
    title: 'Shawshank Redemption',
    year: 1994,
  },
  {
    title: 'The Godfather',
    year: 1972,
  },
  {
    title: 'Goodfellas',
    year: 1990,
  },
  {
    title: "Breakfast at Tiffany's",
    year: 1961,
  },
  {
    title: 'The Notebook',
    year: 2004,
  },
  {
    title: 'Miracle on 34th Street',
    year: 1947,
  },
];

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/movies', (req, res) => {
  res.json(topTen);
});

app.get('/', (req, res) => {
  res.send('Welcome to my Movie_API!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your movie app is listening on port 8080');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});