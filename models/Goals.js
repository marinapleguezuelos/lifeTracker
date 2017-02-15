var mongoose = require('mongoose');

var GoalSchema = new mongoose.Schema({
  description: String,
  ok: { type: Number, default: 0 },
  ko: { type: Number, default: 0 }
}, { collection: 'jesus-goals' });

GoalSchema.methods.addOk = function(callback) {
  if (!this.ok) {
    this.ok = 0;
  }
  this.ok++;
  this.save(callback);
};

GoalSchema.methods.addKo = function(callback) {
  if (!this.ko) {
    this.ko = 0;
  }
  this.ko++;
  this.save(callback);
};

mongoose.model('Goal', GoalSchema);
