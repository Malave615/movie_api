/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8080',
  'http://testsite.com',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://main--malavemovies.netlify.app',
  'https://malavemovies.netlify.app',
  'https://malave615.github.io',
];

/**
 * Custom CORS middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {void}
 * @description This middleware function adds CORS headers to the response object
 * allowing requests from any origin with the specified methods and headers.
 * It also allows preflight requests for all routes.
 */
/* app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}); */

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application does not allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('/movies', cors(corsOptions));

const { check, validationResult } = require('express-validator');

const passport = require('passport');
const auth = require('./auth')(app);
require('./passport');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
// const Genres = Models.Genre;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

/* mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my Movie API!');
});

/**
 * Get list of all movies
 * @method GET
 * @param {string} path - /movies
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with list of all movies
 * @description This function gets a list of all movies from the database
 * and returns them as a JSON object.
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(200).json(movies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      res.status(500).send(`Error: ${err}`);
    }
  },
);

/**
 * Get a movie by title
 * @method GET
 * @param {string} path - /movies/:title
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with movie data
 * @description This function gets a movie by title from the database
 * and returns it as a JSON object.
 */
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const movie = await Movies.findOne({ Title: req.params.title });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie');
    }
  },
);

/**
 * Get data about a genre by name
 * @method GET
 * @param {string} path - /movies/genre/:genreName
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with genre data
 * @description This function gets data about a genre by name from the database
 * and returns it as a JSON object.
 */
app.get(
  '/movies/genre/:genreName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((genre) => {
        res.status(200).json(genre.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

/**
 * Get data about a director by name
 * @method GET
 * @param {string} path - /movies/director/:directorName
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with director data
 * @description This function gets data about a director by name from the database
 * and returns it as a JSON object.
 */
app.get(
  '/movies/director/:directorName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

/**
 * Get list of all users
 * @method GET
 * @param {string} path - /users
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with list of all users
 * @description This function gets a list of all users from the database
 * and returns them as a JSON object.
 */
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

/**
 * Get a user by username
 * @method GET
 * @param {string} path - /users/:Username
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with user data
 * @description This function gets a user by username from the database
 * and returns it as a JSON object.
 */
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

/**
 * User login
 * @method POST
 * @param {string} path - /login
 * @param {Function} middleware - passport.authenticate('local', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with user data and token
 * @description This function logs in a user and returns a JSON object with user data and token.
 * If the user is not found, it returns a 401 status code.
 * If there is an error, it returns a 500 status code.
 * If the user is found, it returns a 201 status code.
 * If the password is incorrect, it returns a 401 status code.
 * If the username is incorrect, it returns a 401 status code.
 * If the login is successful, it returns a 201 status code.
 * If there is an error, it returns a 500 status code.
 */
app.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res) => {
    try {
      const token = auth.generateJWT(req.user);
      return res.status(201).json({ user: req.user, token });
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    }
  },
);

/**
 * Register a new user
 * @method POST
 * @param {string} path - /users
 * @param {Function} middleware - express-validator
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with user data
 * @description This function registers a new user and returns a JSON object with user data.
 * If the username already exists, it returns a 400 status code.
 * If there is an error, it returns a 500 status code.
 * If the user is created, it returns a 201 status code.
 * Validation logic for request
 * Check the validation object for errors
 * Hash the password
 * Check if the username already exists
 * Create a new user with provided data
 */
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non-alphanumeric characters - not allowed.',
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(`${req.body.Username} already exists`);
        }
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((data) => {
            res.status(201).json(data);
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
  },
);

/**
 * Add a movie to a user's list of favorites
 * @method POST
 * @param {string} path - /users/:Username/movies/:MovieID
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with updated user data
 * @description This function adds a movie to a user's list of favorites and returns a JSON object with updated user data.
 * Make sure the updated document is returned
 */
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavMovies: req.params.MovieID },
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

/**
 * Delete a movie from a user's list of favorites
 * @method DELETE
 * @param {string} path - /users/:Username/movies/:MovieID
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with updated user data
 * @description This function deletes a movie from a user's list of favorites and returns a JSON object with updated user data.
 * This line makes sure that the updated document is returned
 */
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavMovies: req.params.MovieID },
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

/**
 * Delete a user by username
 * @method DELETE
 * @param {string} path - /users/:Username
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with message
 * @description This function deletes a user by username and returns a JSON object with a message.
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
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

/**
 * Update a user's info, by username
 * @method PUT
 * @param {string} path - /users/:Username
 * @param {Function} middleware - passport.authenticate('jwt', { session: false })
 * @param {Function} callback - async (req, res)
 * @returns {Object} - JSON object with updated user data
 * @description This function updates a user's info by username and returns a JSON object with updated user data.
 * This line makes sure that the updated document is returned
 * Validation logic for request
 * Check the validation object for errors
 * Condition to check added here
 * End the condition
 */
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non-alphanumeric characters - not allowed.',
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    const hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
    )
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on Port ${port}`);
});
