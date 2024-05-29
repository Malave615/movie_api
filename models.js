const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { Date },
  FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

const genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true },
});

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);
// eslint-disable-next-line no-unused-vars
const Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
