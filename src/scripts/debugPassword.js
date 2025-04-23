require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models.js');

(async () => {
  await mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = await User.findOne({ Username: 'Mushroom' });
  if (!user) {
    console.error('X "Mushroom" not found in DB');
    process.exit(1);
  }

  console.log('Stored hash:', user.Password);
  console.log('compareSync("Almost!") =>', user.validatePassword('Almost!'));

  process.exit(0);
})();
