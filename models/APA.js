const mongoose = require('mongoose')

const APA_Schema = new mongoose.Schema({
  CreatorsGoogleID: {
    type: String,
    required: true,
  },
  APA_Name: {
    type: String,
    required: true,
  },
  APA_Id: {
    type: String,
    required: true,
  },
  BU_Id: {
    type: String,
    required: true,
  },
  StreetId: {
    type: String,
    required: true,
  }
})


module.exports = mongoose.model('APA', APA_Schema)
