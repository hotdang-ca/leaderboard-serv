//TODO: everything!
const mongoose = require('mongoose');

require('dotenv').config();
// env verification
console.log('Verifying env...');
const { DB_USER,
DB_PASS,
DB_SERVER,
DB_PORT,
DB_ENDPOINT,
} = process.env;
if (!DB_USER || !DB_PASS || !DB_SERVER || !DB_PORT || !DB_ENDPOINT) {
  console.error('Environment variables are not set up. Did you check your .env file?');
  return 1;
}

const CONN = `mongodb://${DB_USER}:${DB_PASS}@${DB_SERVER}:${DB_PORT}/${DB_ENDPOINT}`;
mongoose.Promise = global.Promise;

console.log('CONN', CONN);

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
  gender: String,
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score'} ]
});
const User = mongoose.model('User', userSchema);

const scoreSchema = mongoose.Schema({
  place: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
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

      User.findOne({ _id: userId }, (err, match) => {
        if (err) {
          throw("not found.");
        }
        const { _doc } = match;

        cb({
            ..._doc,
            id: _doc._id,
            _id: undefined,
            password: undefined,
          }
        );
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
    update: (id, user, cb) => {
      connect(CONN);

      const conditions = { _id: id };
      const update = {...user};

      console.log('Updating', update);

      const options = {
        new: true,
      };

      User.findOneAndUpdate(conditions, update, {}, (err, doc) => {
        cb(doc);
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
    }
  },

  Scores: {
    add: (scoreObject, cb) => {
      connect(CONN);
      const newScore = new Score(scoreObject);
      const response = newScore.save();
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

    get: (scoreId, cb) => {
      connect(CONN);

      Score.find({ id: scoreId }, (err, matches) => {
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
      Score.find(filter, (err, scores) => {
        if (!err) {
          cb(scores.map((u) => {
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

    update: (id, score, cb) => {
      connect(CONN);
      const conditions = { _id: id };
      const update = {...score};
      const options = {
        new: true,
      };
      Score.findOneAndUpdate(conditions, update, options, (err, doc) => {
        cb(doc);
      });
    },

    delete: (matching, cb) => {
      connect(CONN);
      Score.findOneAndRemove(matching, {}, (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(result);
        }
      });
    },
  },
};
