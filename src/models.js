const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  Birthday: { type: Date, required: true },
  FavMovies: { type: [String], default: [] }, // Array of movie IDs or titles
});

userSchema.pre('save', async function (next) {
  if (this.isModified('Password')) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.Password);
};

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
