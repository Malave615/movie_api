require('dotenv').config();
const mongoose = require('mongoose');
const Models = require('../models.js');

const { Users } = Models;
const NEW_PLAIN_PASSWORD = 'Almost!';

async function reset() {
  try {
    await mongoose.connect(process.env.CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await Users.findOne({ Username: 'Mushroom' });
    if (!user) {
      console.error('X "Mushroom" not found in DB');
      process.exit(1);
    }

    user.Password = Users.hashPassword(NEW_PLAIN_PASSWORD);

    await user.save();
    console.log(`Password for "Mushroom" rest to "${NEW_PLAIN_PASSWORD}"`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  }
}
