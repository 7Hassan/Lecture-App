
const { isAfter } = require('date-fns');
const mongoose = require('mongoose')
const validator = require('validator')

const lecture = {
  name: {
    type: String,
    required: [true, 'Name of lecture is required'],
    maxlength: [50, 'Name of lecture is too long'],
    minlength: [1, 'Name of lecture is too short']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    maxlength: [50, 'Location is too long'],
    minlength: [1, 'Location is too short']
  },
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  doctor: {
    type: String,
    required: [true, 'Doctor is required'],
    maxlength: [50, 'Doctor name is too long'],
    minlength: [1, 'Doctor name is too short']
  },
  start: {
    type: Date,
    required: [true, 'Start of lecture is required'],
  },
  end: {
    type: Date,
    required: [true, 'End of lecture is required'],
    validate: [
      {
        validator: async function (end) {
          return isAfter(new Date(end), new Date(this.start));
        },
        message: "Invalid Time"
      }
    ]
  }
}

const tableSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ["first", "second", "third", "fourth"],
    unique: true,
  },
  Saturday: [lecture],
  Sunday: [lecture],
  Monday: [lecture],
  Tuesday: [lecture],
  Wednesday: [lecture],
  Thursday: [lecture],
  Friday: [lecture]
}, { timestamps: true });


let Table = mongoose.model('tables', tableSchema)
module.exports = Table;