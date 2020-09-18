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
})

module.exports = mongoose.model('APA', APA_Schema)

//DB:API CreatorsGoogleID:null APA_Name:apartmentName APA_Id:apartmentId BU_Id:buildingId ST_Id:streetId