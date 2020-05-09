var debug = require('debug')('rbyc-serv:server');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-express');
var bcrypt = require('bcryptjs');

var PUBLIC_URL = 'http://rbyc.hotdang.ca';

var dbController = require('../models');
const ROLES = {
  User: 'user',
  Admin: 'admin',
};

// TODO: this should be middleware
const checkToken = (jwtToken) => {
  // console.log('stale', jwtToken.stale);
  // console.log('valid', jwtToken.valid);
  if (
    jwtToken
    && jwtToken.stale
    || !jwtToken.valid
  ) {
    return false;
  }

  return true;
};

const tokenGenerator = (userObject) => jwt.create('regina-beach-yacht-club', {
  sub: userObject.username || userObject.email,
  role: userObject.role || ROLES.Staff,
});

/**
 * User Things (auth/signup/etc)
 */
router.post('/users/signin', (req, res, next) => {
  const { email, password } = req.body;
  dbController.Users.list({ email }, 1, (matches) => {
    if (!matches || matches.length === 0) {
      return res.status(401).json({ err: 'No such user.'});
    }

    if (!bcrypt.compareSync(password, matches[0].password)) {
      return res.status(401).json({ err: 'Invalid password.' });  
    }

    return res.status(200).json({ user: matches[0] });
  });

  //   const jwt = tokenGenerator(user);
  //   console.log('Issued jwt: ', jwt);
  //   return res.status(200).json({
  //     success: true,
  //     token: jwt.token,
  //     payload: jwt.payload,
  //     user: {
  //       ...user,
  //       password: undefined,
  //       id: user._id,
  //       _id: undefined,
  //     },
  //   });
  // });
});

router.post('/users/signup', (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
  } = req.body;
  
  var salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password);

  dbController.Users.add({
    firstName,
    lastName,
    email,
    password: encryptedPassword,
    role: role || 'user'
  }, (created) => {
    return res.status(201).json({
      success: 'true',
      user: created,
    });
  });
});

/**
 * List Customers
 */
router.get('/customers', (req, res, next) => {
  // if (!checkToken(req.jwt)) {
  //   return res.status(403).json({ error: 'Unauthenticated' });
  // }; // TODO: this should be middleware

  dbController.Customers.list({}, null, (customers) => {
    if (customers) {
      return res.status(200).json({
        customers,
      });
    }
  });
});

/**
 * Get user by Id
 */
router.get('/customers/:customerId', (req, res, next) => {

});

/**
 * Add Customer
 */
router.post('/customers', (req, res, next) => {
  // if (!checkToken(req.jwt)) {
  //   return res.status(403).json({ error: 'Unauthenticated' });
  // }; // TODO: this should be middleware

  // const { sub, role: adminRole } = req.jwt.payload;
  // if (adminRole !== ROLES.Admin) {
  //   return res.status(401).json({ error: 'Insufficient privileges to do that.'});
  // }

  const {
    memberClass,
    name,
    contactSource,
    street,
    city,
    province,
    postalCode,
    phone,
    email,
    secondaryEmail,
  } = req.body;

  // Validation
  // if (!lastName || !location || !percentage ) { // firstName can be optional, email and password optional
  //   return res.status(400).json({ error: 'Not enough params' });
  // }

  const newCustomer = {
    memberClass,
    name,
    contactSource,
    street,
    city,
    province,
    postalCode,
    phone,
    email,
    secondaryEmail,
  };

  // TODO: find this customer, if firstname and lastname show up, reject.
  // const dupUser = DOCTORS.filter((user) => {
  //   return user.firstName === firstName && user.lastName === lastName;
  // })[0];
  // if (dupUser) {
  //   return res.status(409).json({ error: 'Already have that physician' });
  // }

  dbController.Customers.add(newCustomer, (created) => {
    return res.status(201).json({
      success: 'true',
      customer: created,
    });
  })
});

/**
 * Edit Doctor
 */
router.patch('/customers/:customerId', (req, res, next) => {
  // if (!checkToken(req.jwt)) {
  //   return res.status(403).json({ error: 'Unauthenticated' });
  // }; // TODO: this should be middleware

  // const { sub, role } = req.jwt.payload;
  // if (role !== ROLES.Admin) {
  //   return res.status(401).json({ error: 'Insufficient privileges to do that.'});
  // }

  const customer = req.body;
  // if (doctorObject.password) {
  //   doctorObject.password = bcrypt.hashSync(doctorObject.password);
  // }

  dbController.Customers.update(req.params.customerId, customer, (updated) => {
    return res.status(201).json({
      success: true,
      customer: updated,
    });
  });
});

/**
 * Delete Doctor
 */
router.delete('/customers/:customerId', (req, res, next) => {
  // if (!checkToken(req.jwt)) {
  //   return res.status(403).json({ error: 'Unauthenticated' });
  // }; // TODO: this should be middleware

  // const { sub, role } = req.jwt.payload;
  // if (role !== ROLES.Admin) {
  //   return res.status(401).json({ error: 'Insufficient privileges to do that.'});
  // }


  // TODO: what about the doctors who are at this location?!?
  dbController.Customers.delete({ _id: req.params.customerId }, (result) => {
    let message;
    if (result && result._id) {
      message = 'Deleted Customer';
    } else {
      message = 'Could not delete customer.';
    }

    return res.status(result && result._id ? 201 : 404).json({ message });
  });
});

module.exports = router;
