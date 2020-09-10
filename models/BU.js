const mongoose = require('mongoose')

const BU_Schema = new mongoose.Schema({
 BU_Name: {
    type: String,
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

module.exports = mongoose.model('BU', BU_Schema)
