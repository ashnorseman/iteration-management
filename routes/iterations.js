var express = require('express');
var router = express.Router();
var Iteration = require('../Models/Iteration');

router.get('/', function(req, res, next) {

  Iteration.find({}, null, {
    sort: '-startDate'
  }).select('-developers').exec(function (error, iterations) {
    if (error) console.error(error);

    error
      ? res.sendStatus(400)
      : res.json(iterations.map(i => {
          var result = Object.assign({}, i.toJSON());

          result.total = i.tasks.length;
          result.finished = i.tasks.filter(task => task.status === 'TEST_PASSED').length;
          result.pending = result.total - result.finished;
          delete result.tasks;

          return result;
        }).slice(0, 10));
  });
});

/* iteration management page. */
router.get('/management/:id', function(req, res, next) {

  res.render('iteration', {
    title: 'Iteration Management',
    iteration: {
      _id: req.params.id
    }
  });
});

router.get('/:id', function(req, res, next) {

  Iteration.findById(req.params.id, function (error, iteration) {
    if (error) console.error(error);

    error
      ? res.sendStatus(400)
      : res.json(iteration);
  });
});

router.post('/', function(req, res, next) {
  var iteration = new Iteration(req.body);

  iteration.save(req.body, function (error, iteration) {
    if (error) console.error(error);

    error
      ? res.sendStatus(400)
      : res.json(iteration);
  });
});

router.put('/:id', function(req, res, next) {
  req.body.developers || (req.body.developers = []);

  Iteration.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (error, iteration) {
    if (error) console.log(error);

    error
      ? res.sendStatus(400)
      : res.json(iteration);
  });
});

router.delete('/:id', function(req, res, next) {

  Iteration.findByIdAndRemove(req.params.id, function (error) {
    if (error) console.log(error);

    res.sendStatus(error ? 400 : 200);
  });
});

/* POST add a task. */
router.post('/:id/tasks', function(req, res, next) {
  if (!req.body.assignee) delete req.body.assignee;

  Iteration.findById(req.params.id, function (error, iteration) {
    if (error) console.log(error);

    iteration.tasks.push(req.body);

    iteration.save(function (error, iteration) {
      if (error) console.log(error);

      error
        ? res.sendStatus(400)
        : res.json(iteration);
    });
  });
});

/* DELETE delete a task. */
router.delete('/:id/tasks/:taskId', function(req, res, next) {

  Iteration.findById(req.params.id, function (error, iteration) {
    if (error) console.log(error);

    var task = iteration.tasks.filter(function (task) {
      return task._id.toString() === req.params.taskId;
    });

    if (!task.length) return res.sendStatus(400);

    iteration.tasks.splice(iteration.tasks.indexOf(task[0]), 1);

    iteration.save(function (error, iteration) {
      if (error) console.log(error);

      error
        ? res.sendStatus(400)
        : res.json(iteration);
    });
  });
});

/* PUT edit a task. */
router.put('/:id/tasks/:taskId', function(req, res, next) {
  if (!req.body.assignee) req.body.assignee = null;

  Iteration.findById(req.params.id, function (error, iteration) {
    if (error) console.log(error);

    var task = iteration.tasks.filter(function (task) {
      return task._id.toString() === req.params.taskId;
    });

    if (!task.length) return res.sendStatus(400);

    Object.assign(task[0], req.body);

    iteration.save(function (error, iteration) {
      if (error) console.log(error);

      error
        ? res.sendStatus(400)
        : res.json(iteration);
    });
  });
});

/* PUT edit a task estimate time. */
router.put('/:id/tasks/:taskId/users/:userId', function(req, res, next) {
  if (!req.body.time) req.body.time = 0;

  Iteration.findById(req.params.id, function (error, iteration) {
    if (error) console.log(error);

    var task = iteration.tasks.find(function (task) {
      return task._id.toString() === req.params.taskId;
    });

    if (!task) return res.sendStatus(400);

    if (!task.estimates) task.estimates = [];

    var estimate = task.estimates.find(function (estimate) {
      return estimate.developer.toString() === req.params.userId;
    });

    if (estimate) {
      estimate.time = +req.body.time;
    } else {
      task.estimates.push({
        developer: req.params.userId,
        time: req.body.time
      });
    }

    iteration.save(function (error, iteration) {
      if (error) console.log(error);

      error
        ? res.sendStatus(400)
        : res.json(iteration);
    });
  });
});

module.exports = router;
