require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const MONGO_URI = process.env.CONNECTION_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find();
    for (const user of users) {
      if (!user.Password.startsWith('$2')) {
        const hashed = bcrypt.hashSync(user.Password, 10);
        user.Password = hashed;
        await user.save();
        console.log(`✔ Hashed password for ${user.Username}`);
      } else {
        console.log(`✓ Already hashed: ${user.Username}`);
      }
    }

    console.log('✅ All plain-text passwords have been hashed');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error updating passwords:', err);
    await mongoose.disconnect();
  }
})();
