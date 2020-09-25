const mongoose = require("mongoose");

const APA_PostSchema = new mongoose.Schema({
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
  APA_Id: {
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
  APA_Text: {
    type: String,
    required: false,
  },
  APA_rank: {
    type: Number,
    required: true,
  },
  Cost: {
    type: Number,
    required: true,
  },
  Bills:  {
    type: Number,
    required: false,
  }
},{autoIndex:false});

//unique inforcment indexes
APA_PostSchema.index({APA_Id:1, User_Id:1} , { unique: true })
APA_PostSchema.index({E_Year:1, User_Id:1}, { unique: true })

//quering efficency indexes
APA_PostSchema.index({Post_Id:1})

const apartamentPost = mongoose.model("APA_Post", APA_PostSchema);
apartamentPost.createIndexes()
module.exports = apartamentPost


// DB CreatorsGoogleID Post_Id User_Id APA_Id S_Year E_Year APA_Text APA_rank Cost bills
// API userId googleId apartamentId startYear endYear apartamentText rank rentCost heshbonot