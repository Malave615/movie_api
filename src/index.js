/* eslint-disable no-unused-vars */
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
  'http://localhost:4200'
  'https://main--malavemovies.netlify.app',
  'https://malavemovies.netlify.app', // Make sure there's not trailing slash at the end
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allows requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application does not allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
// Use CORS middleware globally
app.use(cors(corsOptions));
// Allow preflight for all routes
app.options('*', cors());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn't found on the list of allowed origins
        const message = `The CORS policy for this application does not allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  }),
);

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
    const movie = await Movies.findOne({ Title: req.params.title });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie');
    }
  },
);

// Get data about a genre by name
app.get(
  '/movies/genre/:genreName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((genre) => {
        res.status(201).json(genre.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Get data about a director by name
app.get(
  '/movies/director/:directorName',
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
    const hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.username })
      .then((user) => {
        if (!user) {
          return res.status(400).send('User not found');
        }
        if (!user.validatePassword(hashedPassword)) {
          return res.status(400).send('Incorrect password');
        }
        const token = auth.generateJWT(user);
        return res.status(201).json({ token, user: user.Username });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  },
);

// Register a new user
app.post(
  '/users',
  // Validation logic for request
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
    // Check the validation object for errors
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

// Add a movie to a user's list of favorites
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

// Delete a movie from a user's list of favorites
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

// Update a user's info, by username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  // Validation logic for request
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
    // Condition to check added here
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    // Condition ends here
    const hashedPassword = Users.hashPassword(req.body.Password);
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

// Error handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on Port ${port}`);
});
