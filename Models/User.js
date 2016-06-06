var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  UserSchema = new Schema({
    role: {
      type: String,
      enum: ['MASTER', 'USER'],
      default: 'USER',
      required: true
    },
    userName: {
      type: String,
      lowercase: true,
      trim: true,
      maxlength: 100,
      required: true
    },
    password: {
      type: String,
      maxlength: 100,
      expose: false
    },
    name: {
      type: String,
      maxlength: 100,
      required: true
    },
    position: {
      type: String,
      enum: ['FRONT_END', 'BACK_END', 'QA'],
      required: true
    }
  });

UserSchema.set('toJSON', {
  transform: function (doc, result, options) {
    delete result.password;
    return result;
  }
});


module.exports = mongoose.model('User', UserSchema);
