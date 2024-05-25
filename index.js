const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
const Models = require('./models.js');
// Remove the duplicate declaration of 'passport'
// const passport = require('passport');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my Movie API!');
});

// Get list of all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Get a movie by title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title } = req.params.title;
    const movie = await Movies.findOne({ Title: title });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie');
    }
  },
);

// Get data about a genre by name
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const genre = await Genres.findOne({ Name: req.params.genreName });
      if (genre) {
        res.status(201).json(genre.Description);
      } else {
        res.status(400).send('no such genre');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    }
  },
);

// Get data about a director by name
app.get(
  '/movies/directors/:directorName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.status(201).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Get list of all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Get a user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// User login
app.post(
  '/login',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const newUser = req.body;
    newUser.id = uuid.v4();
    res.send('Successful POST request returning an authentication token');
  },
);

// Register a new user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username} already exists`);
      }
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send(`Error: ${error}`);
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

// Delete a movie from a user's list of favorites
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Delete a user by username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found`);
        } else {
          res.status(200).send(`${req.params.Username} was deleted.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Update a user's info, by username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Your movie app is listening on port 8080');
});
