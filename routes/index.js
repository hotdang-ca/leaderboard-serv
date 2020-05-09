var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const { host } = req.headers;

  // if (host.includes('localhost') || host.includes('127.0.0.1')) {
  //   res.redirect(302, 'http://localhost:3000/dashboard');
  // };

  // res.redirect(302, '/dashboard');
  return next();
});

module.exports = router;
