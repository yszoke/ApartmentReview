const mongoose = require('mongoose')

const APA_Schema = new mongoose.Schema({
  APA_Name: {
    type: String,
    required: true,
  },
  APA_Id: {
    type: Number,
    required: true,
  },
  BU_Id: {
    type: Number,
    required: true,
  },
  StreetId: {
    type: String,
    required: true,
  }
})


module.exports = mongoose.model('APA', APA_Schema)
