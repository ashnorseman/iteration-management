var express = require('express'),
  router = express.Router(),
  User = require('../Models/User');

router.get('/', function (req, res, next) {

  User.find({}, null, {
    sort: 'position'
  }, function (error, users) {
    if (error) console.error(error);

    error
      ? res.sendStatus(400)
      : res.json(users);
  });
});

router.post('/', function (req, res, next) {
  var user = new User(req.body);

  user.save(function (error, user) {
    if (error) console.error(error);

    error
      ? res.sendStatus(400)
      : res.json(user);
  });
});

module.exports = router;
