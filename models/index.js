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

const scoreSchema = mongoose.Schema({
  place: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
});
const Score = mongoose.model('Score', scoreSchema);

const eventSchema = mongoose.Schema({
  name: String,
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }],
});
const Event = mongoose.model('Event', eventSchema);

const divisionSchema = mongoose.Schema({
  name: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});
const Division = mongoose.model('Division', divisionSchema);

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
  },

  Divisions: {
    add: (divisionObject, cb) => {
      connect(CONN);
      const newDivision = new Division(divisionObject);
      const response = newDivision.save();
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

    get: (divisionId, cb) => {
      connect(CONN);

      Division
        .findOne({ _id: divisionId })
        .populate('events')
        .exec((err, match) => {
          cb({
              ...match._doc,
              _id: undefined,
              id: match._doc._id,
              "__v": undefined,
            });
        });
    },

    list: (filter, limit, cb) => {
      connect(CONN);
      Division.find(filter)
        .populate('events')
        .exec((err, divisions) => {
          console.log('divisions', divisions);

          if (!err) {
            cb(divisions.map((d) => {
              return {
                ...d._doc,
                _id: undefined,
                id: d._doc._id,
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
      Division.findOneAndRemove(matching, {}, (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(result);
        }
      });
    },
    update: (id, division, cb) => {
      connect(CONN);
      const conditions = { _id: id };
      const update = {...division};
      const options = {
        new: true,
      };
      Division.findOneAndUpdate(conditions, update, options, (err, doc) => {
        cb(doc);
      });
    }
  },

  Events: {
    add: (eventObject, cb) => {
      connect(CONN);
      const newEvent = new Event(eventObject);
      const response = newEvent.save();
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

    get: (eventId, cb) => {
      connect(CONN);

      Event.find({ id: eventId }, (err, matches) => {
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
      
      Event.find(filter, (err, events) => {
        if (!err) {
          cb(events.map((u) => {
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
      Event.findOneAndRemove(matching, {}, (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(result);
        }
      });
    },
    update: (id, event, cb) => {
      connect(CONN);
      const conditions = { _id: id };
      const update = {...event};
      const options = {
        new: true,
      };
      Event.findOneAndUpdate(conditions, update, options, (err, doc) => {
        cb(doc);
      });
    }
  },
};
