const mongoose = require('mongoose')
const Buildings = require('./BU')

const BU_PostSchema = new mongoose.Schema({
  CreatorsGoogleID: {
    type: String,
    required: true,
  },
  Post_Id: {
    type: String,
    required: true,
  },
  User_Id: {
    type: String,
    required: true,
  },
  BU_Id: {
    type: String,
    required: true,
  },
  APA_Id:{
    type: String,
    required: true,
  },
  S_Year: {
    type: Number,
    required: true,
  },
  E_Year: {
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
  BU_Rank: {
    type: Number,
    required: true,
  }
},{autoIndex:false})

//unique inforcment indexes
BU_PostSchema.index({BU_Id:1, User_Id:1}, { unique: true })

//quering efficency indexes
BU_PostSchema.index({Post_Id:1})

const BuildingPost = mongoose.model('BU_Post', BU_PostSchema)
BuildingPost.createIndexes()
module.exports =BuildingPost
//DB:API CreatorsGoogleID:null Post_Id:postId User_Id:userId BU_Id:buildingId APA_Id:apartamentID S_Year:startYear E_Year:endYear BU_Students:levelOfStudents BU_Text:buildingText BU_rank:buildingRank
 

//unique inforcment indexes

//quering efficency indexes
