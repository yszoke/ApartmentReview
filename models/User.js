const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  User_Id:{
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
  activeYears: [{
    Year:{
      type: Number,
      required: true,
    },
    PostId:{
      type: String,
      required: true,
    }
  }]
},{autoIndex:false})


//unique inforcment indexes

//quering efficency indexes
UserSchema.index({userId:1})
const Users = mongoose.model('User', UserSchema)
Users.createIndexes()
module.exports = Users
