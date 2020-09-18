const mongoose = require('mongoose')

const StreetSchema = new mongoose.Schema({
  ST_Id:{
    type: String,
    required: true,
  },
  DB_Name: {
    type: String,
    required: true,
  },
  DB_Buildings: [{
    Id:{
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    }
  }]
})

module.exports = mongoose.model('Street', StreetSchema)
//DB:API ST_Id:Id  DB_Name:streetName  DB_Buildings:Buildings