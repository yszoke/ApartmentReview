const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  userId:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{autoIndex:false})


//unique inforcment indexes

//quering efficency indexes
UserSchema.index({userId:1})

module.exports = mongoose.model('User', UserSchema)

