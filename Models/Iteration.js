/**
 * Created by Ash on 2016-06-04.
 */

var moment = require('moment'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  TaskSchema = new Schema({
    module: {
      type: String,
      maxlength: 100
    },
    subModule: {
      type: String,
      maxlength: 100
    },
    taskName: {
      type: String,
      maxlength: 200
    },
    priority: {
      type: Number,
      min: 0,
      max: 2,
      default: 0
    },
    estimates: [{
      developer: Schema.Types.ObjectId,
      time: Number
    }],
    assignee: Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'DEVELOPED', 'TEST_FAILED', 'TEST_PASSED'],
      default: 'NOT_STARTED'
    }
  }),

  IterationSchema = new Schema({
    year: {
      type: Number,
      required: true
    },
    number: {
      type: Number,
      min: 1,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: '`endDate` must be later than `startDate`'
      }
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || (value > this.startDate && value <= this.endDate);
        },
        message: '`deadline` must be later than `startDate` and earlier or equal to `endDate`'
      }
    },
    developers: {
      type: [Schema.Types.ObjectId],
      default: []
    },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUCCESS', 'FAILURE'],
      default: 'NOT_STARTED'
    },
    tasks: {
      type: [TaskSchema],
      default: []
    }
  });

IterationSchema.set('toJSON', {
  transform: function (doc, result, options) {
    var format = 'YYYY-MM-DD';

    result.startDate = moment(result.startDate).format(format);
    result.endDate = moment(result.endDate).format(format);
    result.deadline = result.deadline ? moment(result.deadline).format(format) : null;
    return result;
  }
});


module.exports = mongoose.model('Iteration', IterationSchema);
