const mongoose = require('mongoose')

const StreetSchema = new mongoose.Schema({
  ST_Id:{
    type: String,
    required: true,
  },
  ST_Name: {
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
},{autoIndex:false})

StreetSchema.index({DB_Name:1}, { unique: true })
const streetModule=mongoose.model('Street', StreetSchema)
streetModule.createIndexes()
module.exports = streetModule
 //DB:API ST_Id:Id  DB_Name:streetName  DB_Buildings:Buildingsindex

