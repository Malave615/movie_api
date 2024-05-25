/* eslint-disable no-unused-vars */
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



// Update a user's info, by username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
          FavoriteMovies: req.body.FavoriteMovies,
        },
      },
      { new: true },
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);