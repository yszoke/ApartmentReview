const mongoose = require("mongoose");

const APA_PostSchema = new mongoose.Schema({
  CreatorsGoogleID: {
    type: String,
    required: true,
  },
  PostId: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
  APA_Id: {
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
  APA_Text: {
    type: String,
    required: false,
  },
  APA_rank: {
    type: Number,
    required: true,
  },
  rentCost: {
    type: Number,
    required: true,
  },
  heshbonot:  {
    type: Number,
    required: false,
  }
});

module.exports = mongoose.model("APA_Post", APA_PostSchema);

//  PostId:  UserId: APA_Id: startYear: endYear: APA_Text: APA_rank: rentCost: heshbonot:  