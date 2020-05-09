//TODO: everything!
const mongoose = require('mongoose');

const DB_USER = process.env.DB_USER || 'villain';
const DB_PASS = process.env.DB_PASS || 'Vumbec-nexqoz-0pakji';
const DB_SERVER = process.env.DB_SERVER || 'ds011810.mlab.com';
const DB_PORT = process.env.DB_PORT || 11810;
const DB_ENDPOINT = process.env.DB_ENDPOINT || 'villainstrength';

const CONN = `mongodb://${DB_USER}:${DB_PASS}@${DB_SERVER}:${DB_PORT}/${DB_ENDPOINT}`;
mongoose.Promise = global.Promise;

const connect = (connectionString) => {
  if (typeof mongoose !== 'undefined') {
    mongoose.connect(connectionString);
  }
};

// schemas
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String, // Enum: 'admin' | 'user'
  teamName: String,
  gymName: String,
});
const User = mongoose.model('User', userSchema);

module.exports = {
  Users: {
    add: (userObject, cb) => {
      connect(CONN);
      const newUser = new User(userObject);
      const response = newUser.save();
      response.then((result) => {
        cb(result && {
          ...result._doc,
          _id: undefined,
          id: result._doc._id,
        });
      }).catch((err) => {
        cb(err);
      });
    },
    get: (userId, cb) => {
      connect(CONN);

      User.find({ id: userId }, (err, matches) => {
        cb(matches.map((u) => {
          return {
            ...u._doc,
            _id: undefined,
            id: u._doc._id,
            "__v": undefined,
          }
        }));
      });
    },
    list: (filter, limit, cb) => {
      connect(CONN);
      User.find(filter, (err, users) => {
        if (!err) {
          cb(users.map((u) => {
            return {
              ...u._doc,
              _id: undefined,
              id: u._doc._id,
              "__v": undefined,
            }
          }));
        } else {
          cb(err);
        }
      });
    },
    delete: (matching, cb) => {
      connect(CONN);
      User.findOneAndRemove(matching, {}, (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(result);
        }
      });
    },
    update: (id, user, cb) => {
      connect(CONN);
      const conditions = { _id: id };
      const update = {...user};
      const options = {
        new: true,
      };
      User.findOneAndUpdate(conditions, update, options, (err, doc) => {
        cb(doc);
      });
    }
  }
};
