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
  ST_Id: {
    type: String,
    required: true,
  }
},{autoIndex:false})

//unique inforcment indexes
APA_Schema.index({BU_Id:1, APA_Name:1}, { unique: true })

//quering efficency indexes
APA_Schema.index({APA_Id:1})
const Apartments = mongoose.model('APA', APA_Schema)
Apartments.createIndexes()
module.exports = Apartments

//DB:API CreatorsGoogleID:null APA_Name:apartmentName APA_Id:apartmentId BU_Id:buildingId ST_Id:streetId

