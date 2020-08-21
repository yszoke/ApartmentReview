const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  googleID : {
    type : String,
    required : true
  },
  DisplayName : {
    type : String,
    required : true
  },
  LastName : {
    type : String,
    required : true
  },
  createdAt : {
    type : String,
    required : true
  },
  Email : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model('User',userSchema)