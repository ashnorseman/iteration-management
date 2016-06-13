var express = require('express'),
  router = express.Router(),
  User = require('../Models/User');

/* login. */
router.post('/login', function(req, res, next) {

  User.findOne({
    userName: req.body.userName,
    password: req.body.password
  }, function (error, user) {
    if (error) console.error(error);

    error
      ? res.sendStatus(401)
      : res.json(user);
  });
});

module.exports = router;
