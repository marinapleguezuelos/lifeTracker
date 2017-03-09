var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goal = mongoose.model('Goal');
var Day = mongoose.model('Day');


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

router.param('day', function(req, res, next, id){
  var date = new Date();
  date.setFullYear(id.substr(0, 4));
  date.setMonth(parseInt(id.substr(4, 2))-1);
  date.setDate(id.substr(6, 2));
  req.date = date;
  return next();
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

router.get('/days/:day', function(req, res, next) {
  queryDate(req.date, function (error, day) {
    if (error) { return next(error); }
    res.json(day);
  });
});

router.post('/goals', function(req, res, next) {
  var goal = new Goal(req.body);
  goal.save(function(err, goal){
    if(err){ return next(err); }
    res.json(goal);
  });
});

function queryDate(date, callback){
  // Query date
  var queryDate = new Date(date);
  queryDate.setHours(0);
  queryDate.setMinutes(0);
  queryDate.setSeconds(0);
  var maxDate = new Date(queryDate);
  maxDate.setDate(maxDate.getDate()+1);
  var query = Day.findOne({day: {$gte: queryDate, $lt: maxDate}});
  query.exec(callback);
}

function getOrCreateDay(date, callback){
  queryDate(date, function(err, day){
    if (err) { return callback(err); }
    if (day) { return callback(null, day); }
    // If day does not exist, create it with the current goals
    day = new Day({day: date});
    // Get current goals
    Goal.find(function(err, goals){
      if(err){ return callback(err); }
      // Take useful fields only (_id and description)
      var goalsShort = [];
      for (var i=0; i<goals.length; i++) {
        var g = {
          _id: goals[i]._id,
          description: goals[i].description
        }
        goalsShort.push(g);
      }
      day.goals = goalsShort;
      return callback(null, day);
    });
  });
}

router.put('/goals/:goal/ok', function(req, res, next) {
  getOrCreateDay(req.body.day, function(error, day){
    if (error) { return next(error); }
    day.addOk(req.params.goal, function(saveError, savedDay){
      if (saveError) { return next(saveError); }
      req.goal.addOk(function(addError, goal) {
        if (addError) { return next(addError); }
        res.json(savedDay);
      });
    });
  });
});

router.put('/goals/:goal/ko', function(req, res, next) {
  getOrCreateDay(req.body.day, function(error, day){
    if (error) { return next(error); }
    day.addKo(req.params.goal, function(saveError, savedDay){
      if (saveError) { return next(saveError); }
      req.goal.addKo(function(addError, goal) {
        if (addError) { return next(addError); }
        res.json(savedDay);
      });
    });
  });
});

router.delete('/goals/:goal', function(req, res, next) {
  Goal.remove({_id: req.params.goal}, function (err) {
  if (err) { return next(err); }
  res.sendStatus(204);
  });
});


module.exports = router;
