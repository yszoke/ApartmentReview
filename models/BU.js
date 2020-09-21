const mongoose = require('mongoose')

const BU_Schema = new mongoose.Schema({
  CreatorsGoogleID: {
    type: String,
    required: true,
  },
  BU_Name: {
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
  },
  DB_Apartments: [{
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

//unique inforcment indexes
BU_Schema.index({ST_Id:1, BU_Name:1}, { unique: true })

//quering efficency indexes
BU_Schema.index({BU_Id:1})

module.exports = mongoose.model('Buildings', BU_Schema)

// DB:API CreatorsGoogleID:null BU_Name:buildingName BU_Id:buildinId ST_Id:streetId DB_Apartments:apartments
