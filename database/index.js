const mongoose = require('mongoose');
const { Places } = require('./models/places.js');

mongoose.connect(
  // 'mongodb://database/DropTable',
  'mongodb://localhost:27017/Luber',
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('connected!');
});

const getLocations = (callback) => {
  Places.find({})
    .sort('-_id')
    .limit(10)
    .exec((err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
};


const postLocation = (location, callback) => {
  const place = new Places(location);
  place.save((err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null);
    }
  });
};

module.exports = { getLocations, postLocation };
