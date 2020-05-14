var debug = require('debug')('rbyc-serv:server');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// var PUBLIC_URL = 'http://rbyc.hotdang.ca';

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
  const leaderboardData = {
    divisions: [],
  };

  dbController.Divisions.list({}, null, (divisions) => {
    // we now have all divisions; let's get all events
    dbController.Events.list({}, null, (events) => {
      // we now have all events; let's get scores for each event
      dbController.Scores.list({}, null, (scores) => {
        // we have all scores; let's get users
        dbController.Users.list({}, null, (users) => {
          // we have everything; let's build leaderboard data
          console.log(`${divisions.length} divisions, ${events.length} events, ${scores.length} scores, ${users.length} users.`);

          try {
            divisions.forEach((division) => {
              leaderboardData.divisions.push({
                name: division.name,
                events: [],
              });

              const divisionEvents = events.filter((e) => e.division.toString() === division.id.toString());
              console.log(`Division ${division.id.toString()} has ${divisionEvents.length} events.`);

              leaderboardData.divisions
                .find((d) => d.name === division.name).events = divisionEvents.map((de) => ({
                name: de.name,
                scores: [],
              }));

              divisionEvents.forEach((event) => {
                const eventScores = scores.filter((s) => s.event.toString() === event.id.toString());  
                eventScores.forEach((score) => {

                  const user = users.find((u) => u.id.toString() === score.user.toString());
                  console.log(`D: ${division.id.toString()}, E: ${event.id.toString()}, S: ${score.id.toString()}, U: ${user.id.toString()}`);

                  const thisDivision = leaderboardData.divisions.find((d) => d.name === division.name);
                  console.log('Division: ', thisDivision.name, thisDivision);

                  const thisDivisionEvent = thisDivision.events.find((e) => e.name === event.name);
                  console.log('Event: ', thisDivisionEvent);

                  leaderboardData.divisions
                    .find((d) => d.name === division.name)
                    .events.find((e) => e.name === event.name)
                    .scores.push({
                      scoreId: score.id.toString(),
                      place: score.place,
                      userId: user.id.toString(),
                      firstName: user.firstName,
                      lastInitial: user.lastName,
                      gender: user.gender,
                      teamName: user.teamName || '',
                      gymName: user.gymName || '',
                      score: score.score,
                    });
                }); // each score
              }); // each event
            }); // each division

            return res.status(200).json({ status: 'ok', leaderboardData });

          } catch (e) {
            res.status(500).json({ error: 'Could not determine score data.' });
          }
          
        }); // end of database cbs
      });
    });
  });
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
 * Add new score
 */
router.post('/scores', (req, res, next) => {
  const { user, event, score } = req.body;

  // we will not allow a duplicate score
  dbController.Scores.list({ user, event }, null, (results) => {
    console.log(results);

    if (results && results.length > 0) {
      // TODO: maybe upsert it
      return res.status(409).json({ error: 'You already have a score for this event.'})
    }

    const scoreData = {
      user,
      event,
      score,
    };
  
    dbController.Scores.add(scoreData, (created) => {
      dbController.Scores.updateRanking(user, event, (place) => {
        return res.status(201).json({
          success: 'true',
          score: created,
          place,
        });
      });
    });
  });
});

/**
 * Delete a score by ID
 */
router.delete('/scores/:scoreId', (req, res, next) => {
  const { scoreId } = req.params;
  dbController.Scores.delete({ _id: scoreId }, (deleted) => {
    console.log('deleted', deleted);

    const { user, event } = deleted;
    dbController.Scores.updateRanking(user, event, (_) => {
    
      return res.status(204).json();
    
    });
  });    
});

module.exports = router;
