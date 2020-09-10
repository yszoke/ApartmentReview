const mongoose = require("mongoose");

const APA_PostSchema = new mongoose.Schema({
  
  PostId: {
    type: Number,
    required: true,
  },
  UserId: {
    type: Number,
    required: true,
  },
  APA_Id: {
    type: Number,
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
