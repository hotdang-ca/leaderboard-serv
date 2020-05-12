var debug = require('debug')('rbyc-serv:server');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// var PUBLIC_URL = 'http://rbyc.hotdang.ca';

// TODO: replace with actual data calls
const _leaderboardData = {
  divisions: [
      {
          name: 'division a',
          events: [
              {                  
                  name: 'event a',
                  scores: [
                      {
                          scoreId: 1,
                          place: 1,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 261,
                      },
                      {
                          scoreId: 2,
                          place: 2,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 260,
                      },
                      {
                          scoreId: 3,
                          place: 3,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 259,
                      },
                      {
                          scoreId: 4,
                          place: 1,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 261,
                      },
                      {
                          scoreId: 5,
                          place: 2,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 260,
                      },
                      {
                          scoreId: 6,
                          place: 3,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 259,
                      },
                      {
                          scoreId: 7,
                          place: 4,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 261,
                      },
                      {
                          scoreId: 8,
                          place: 5,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 260,
                      },
                      {
                          scoreId: 9,
                          place: 6,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 259,
                      },
                      {
                          scoreId: 10,
                          place: 4,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 261,
                      },
                      {
                          scoreId: 11,
                          place: 5,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 260,
                      },
                      {
                          scoreId: 12,
                          place: 6,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 259,
                      },
                  ],
              },
              {                  
                  name: 'event b',
                  scores: [
                      {
                          scoreId: 13,
                          place: 1,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 400,
                      },
                      {
                          scoreId: 14,
                          place: 2,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 392,
                      },
                      {
                          scoreId: 15,
                          place: 3,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 199,
                      },
                      {
                          scoreId: 16,
                          place: 1,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 500,
                      },
                      {
                          scoreId: 17,
                          place: 2,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 480,
                      },
                      {
                          scoreId: 18,
                          place: 3,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 450,
                      }
                  ],
              }
          ]
      },
      {
          name: 'division b',
          events: [
              {                  
                  name: 'event c',
                  scores: [
                      {
                          scoreId: 19,
                          place: 3,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 100,
                      },
                      {
                          scoreId: 20,
                          place: 2,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 75,
                      },
                      {
                          scoreId: 21,
                          place: 1,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 50,
                      },
                      {
                          scoreId: 22,
                          place: 1,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 100,
                      },
                      {
                          scoreId: 23,
                          place: 3,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 75,
                      },
                      {
                          scoreId: 24,
                          place: 2,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 100,
                      }
                  ],
              },
              {                  
                  name: 'event d',
                  scores: [
                      {
                          scoreId: 25,
                          place: 1,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 175,
                      },
                      {
                          scoreId: 26,
                          place: 2,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 150,
                      },
                      {
                          scoreId: 27,
                          place: 3,
                          firstName: 'James',
                          lastInitial: 'P',
                          gender: 'M',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 100,
                      },
                      {
                          scoreId: 28,
                          place: 1,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'Crossfit Truro',
                          gymName: 'Crossfit Truro',
                          score: 175,
                      },
                      {
                          scoreId: 29,
                          place: 2,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'CFA Misfits',
                          gymName: 'CROSSFIT ASCOT',
                          score: 150,
                      },
                      {
                          scoreId: 30,
                          place: 3,
                          firstName: 'Dara',
                          lastInitial: 'P',
                          gender: 'F',
                          teamName: 'THE BOX ROGUES',
                          gymName: 'THE BOX - CROSSFIT TAUNTON',
                          score: 100,
                      }
                  ],
              }
          ]
      },
  ],
};

var dbController = require('../models');
const ROLES = {
  User: 'user',
  Admin: 'admin',
};

/**
 * Sign in user
 */
router.post('/users/login', (req, res, next) => {
  const { email, password } = req.body;
  
  dbController.Users.list({ email }, 1, (matches) => {
    console.log('matches', matches);

    if (!matches || matches.length === 0) {
      return res.status(401).json({ error: 'No such user.'});
    }

    if (!bcrypt.compareSync(password, matches[0].password)) {
      return res.status(401).json({ error: 'Invalid password.' });  
    }

    return res.status(200).json({ user: matches[0] });
  });
});

/**
 * Register new user
 */
router.post('/users/register', (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    teamName,
    gymName,
    role,
  } = req.body;
  
  // do we have this user?
  dbController.Users.list({ email }, null, (duplicates) => {
    console.log('duplicates', duplicates);
    if (duplicates.length) {
      return res.status(400).json({ error: 'Duplicate user. Use a different email address.'});
    }

    bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password);
  
    dbController.Users.add({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: role || 'user',
      teamName,
      gymName,
    }, (created) => {
      return res.status(201).json({
        success: 'true',
        user: created,
      });
    });
  });
});

/**
 * List users
 */
router.get('/users', (req, res, next) => {
  dbController.Users.list({}, null, (matches) => {
    return res.status(200).json({
      users: matches.map((m) => ({...m, password: undefined })),
    });
  });
});

/**
 * Get User profile
 */
router.get('/users/:userId', (req, res, next) => {
  dbController.Users.get(req.params.userId, (match) => {
    return res.status(200).json({
      user: match,
    });
  });
});

/**
 * Get scores just for this user
 */
router.get('/users/:userId/scores', (req, res, next) => {
  dbController.Scores.list({ user: req.params.userId }, null, (matches) => {
    return res.status(200).json({
      scores: matches,
    });
  });
});

/**
 * Update user (eg profile)
 */
router.put('/users/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { user } = req.body;

  dbController.Users.update(userId, user, (updated) => {
    return res.status(204).json({ status: 'ok' });
  });
});

/**
 * List users of team
 */
router.get('/users/teams/:teamName', (req, res, next) => {
  dbController.Users.list({ teamName: req.params.teamName }, null, (matches) => {
    return res.status(200).json({
      users: matches.map((m) => ({...m, password: undefined })) || [],
    });
  });
});

/**
 * List users of gym
 */
router.get('/users/gym/:gymName', (req, res, next) => {
  dbController.Users.list({ gymName: req.params.gymName }, null, (matches) => {
    return res.status(200).json({
      users: matches.map((m) => ({...m, password: undefined })) || [],
    });
  });
});

/**
 * Leaderboard data stub
 */
router.get('/leaderboards/all', (req, res, next) => {
  const payload = _leaderboardData;
  return res.status(200).json(payload);
});

/**
 * Get list of divisions
 */
router.get('/divisions', (req, res, next) => {
  dbController.Divisions.list({}, null, ((divisions) => {
    return res.status(200).json({ divisions });
  }));
});

/**
 * Get details of a particular division
 */
router.get('/divisions/:divisionId', (req, res, next) => {
  dbController.Divisions.get(req.params.divisionId, ((division) => {
    return res.status(200).json({ division });
  }));
});

/**
 * Get events belonging to division
 */
router.get('/divisions/:divisionId/events', (req, res, next) => {
  dbController.Events.list({ division: req.params.divisionId, }, null, ((events) => {
    return res.status(200).json({ events });
  }));
});

/**
 * Create new division
 */
router.post('/divisions', (req, res, next) => {
  const { name } = req.body;
  dbController.Divisions.add({ name }, (created) => {
    return res.status(201).json({
      success: 'true',
      division: created,
    });
  });
});

/**
 * Get all events
 */
router.get('/events', (req, res, next) => {
  dbController.Events.list({}, null, (events) => {
    return res.status(200).json({
      events,
    });
  });
});

/**
 * Create event
 */
router.post('/events', (req, res, next) => {
  const { name, division } = req.body;

  dbController.Events.add({
    name,
    division,
  }, (created) => {
    return res.status(201).json({
      success: 'true',
      event: created,
    });
  });
});

/**
 * Get all scores
 */
router.get('/scores', (req, res, next) => {
  dbController.Scores.list({}, null, (scores) => {
    return res.status(200).json({
      scores,
    });
  });
});

/**
 * Get scores belonging to event
 */

router.get('/events/:eventId/scores', (req, res, next) => {
  dbController.Scores.list({ event: req.params.eventId }, null, (results) => {
    return res.status(200).json({
      scores: results,
    });
  });
});

/**
 * Put new score
 */
router.post('/scores', (req, res, next) => {
  const { user, event, score } = req.body;

  const scoreData = {
    user,
    event,
    score,
  };

  dbController.Scores.add(scoreData, (created) => {
    return res.status(201).json({
      success: 'true',
      score: created,
    });
  });
});

module.exports = router;
