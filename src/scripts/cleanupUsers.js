require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models');

const MONGO_URI = process.env.CONNECTION_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const badUsers = await User.find({
      $or: [{ Username: { $exists: false } }, { Password: { $exists: false } }],
    });

    if (badUsers.length === 0) {
      console.log('✅ No users missing Username or Password.');
    } else {
      console.log(`⚠️ Found ${badUsers.length} users with missing fields:`);
      badUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user._id}`);
      });

      const result = await User.deleteMany({
        _id: { $in: badUsers.map((u) => u._id) },
      });

      console.log(`🧹 Deleted ${result.deletedCount} incomplete users.`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    await mongoose.disconnect();
  }
})();
