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
  StreetId: {
    type: String,
    required: true,
  },
  Apartments: [{
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

module.exports = mongoose.model('BU', BU_Schema)

/*

 BU_Name:  BU_Id:   StreetId:  Apartments: 

*/

