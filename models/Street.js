const mongoose = require('mongoose')

const StreetSchema = new mongoose.Schema({
  Id:{
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Street', StreetSchema)
