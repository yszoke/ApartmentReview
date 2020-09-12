const mongoose = require('mongoose')

const BU_PostSchema = new mongoose.Schema({
  PostId: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
  BU_Id: {
    type: String,
    required: true,
  },
  startYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
  BU_Students: {
    type: Number,//1-5
    required: true,
  },
  BU_Text: {
    type: String,
    required: false,
  },
  BU_rank: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('BU_Post', BU_PostSchema)
