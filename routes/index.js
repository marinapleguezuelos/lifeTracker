var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goal = mongoose.model('Goal');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('goal', function(req, res, next, id) {
  var query = Goal.findById(id);
  query.exec(function (err, goal){
    if (err) { return next(err); }
    if (!goal) { return next(new Error('Can\'t find goal ' + id)); }
    req.goal = goal;
    return next();
  });
});

router.get('/goals', function(req, res, next) {
  Goal.find(function(err, goals){
    if(err){ return next(err); }
    res.json(goals);
  });
});

router.get('/goals/:goal', function(req, res) {
  res.json(req.goal);
});

router.post('/goals', function(req, res, next) {
  var goal = new Goal(req.body);
  goal.save(function(err, goal){
    if(err){ return next(err); }
    res.json(goal);
  });
});

router.put('/goals/:goal/ok', function(req, res) {
  req.goal.addOk(function(err, goal) {
    if (err) { return next(err); }
    res.json(goal);
  });
});

router.put('/goals/:goal/ko', function(req, res) {
  req.goal.addKo(function(err, goal) {
    if (err) { return next(err); }
    res.json(goal);
  });
});

router.delete('/goals/:goal', function(req, res, next) {
  Goal.remove({_id: req.params.goal}, function (err) {
  if (err) { return next(err); }
  res.sendStatus(204);
  });
});


module.exports = router;
