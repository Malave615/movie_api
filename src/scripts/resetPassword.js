require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Models = require('../models');

const { User } = Models;

const MONGO_URI = process.env.CONNECTION_URI;

(async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ Username: 'Mushroom' });
    if (!user) {
      console.error('X "Mushroom" not found in DB');
      process.exit();
    }

    const hashed = bcrypt.hashSync('Almost!', 10);
    user.Password = hashed;
    await user.save();

    console.log(`Password for "Mushroom" rest to "Almost!"`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Error resetting password:', err);
    mongoose.disconnect();
  }
})();
