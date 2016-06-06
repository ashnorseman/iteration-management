var express = require('express'),
  router = express.Router(),
  User = require('../Models/User');

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Iterations Management' });
});

/* login. */
router.post('/login', function(req, res, next) {

  User.findOne(req.body, function (error, user) {
    if (error) console.error(error);

    res.sendStatus((error || !user) ? 401 : 200);
  });
});

module.exports = router;
