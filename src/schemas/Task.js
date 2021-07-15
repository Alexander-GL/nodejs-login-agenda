var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../schemas/user');

var TaskSchema = Schema({
  title: String,
  date: Date,
  description: String,
  status: { type: Boolean, default: false },
  schedule: { type: Schema.ObjectId, ref: "User" }
});

module.exports = mongoose.model('tasks', TaskSchema);
