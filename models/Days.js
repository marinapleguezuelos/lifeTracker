var mongoose = require('mongoose');

var DaySchema = new mongoose.Schema({
  day: Date,
  goals: [mongoose.Schema.Types.Mixed]
}, { collection: 'jesus-days' });

DaySchema.methods.addOk = function(goalId, callback) {
  for (var i = 0; i < this.goals.length; i++) {
    if (this.goals[i]._id == goalId) {
      this.goals[i].result = 1;
      this.markModified('goals');
      break;
    }
  }
  this.save(callback);
}

DaySchema.methods.addKo = function(goalId, callback) {
  for (var i = 0; i < this.goals.length; i++) {
    if (this.goals[i]._id == goalId) {
      this.goals[i].result = -1;
      this.markModified('goals');
      break;
    }
  }
  this.save(callback);
}

mongoose.model('Day', DaySchema);
