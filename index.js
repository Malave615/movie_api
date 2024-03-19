const express = require('express');
const app = express();
const morgan = require('morgan');

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

app.use(morgan('common'));

app.get('/movies', (req, res) => {
  res.json(topTen);
});

app.get('/', (req, res) => {
  res.send('Here is my movie list!');
});

app.use(express.static('public'));