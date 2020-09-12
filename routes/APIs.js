const express = require("express")
const router = express.Router()
const {  ensureAuth } = require('../middleware/auth')
const uuidv4 = require ('uuid').v4 //uuidv4();
const Street = require('../models/Street')
const BU = require('../models/BU')
const APA = require('../models/APA')
const BU_Post = require('../models/BU_post')
const APA_Post = require('../models/APA_post')



//@desc create new street
router.post('/createStreet', ensureAuth, (req , res)=>{
  const newStreet = {
    Id:uuidv4(),
    Name: req.body.streetName
  }
  if(req.body.paswword == process.env.adminPaswword) Street.create(newStreet)  
  res.json({id: newStreet.Id})
})


//@desc create new building
router.post('/createBuilding', ensureAuth, (req, res) => {
  const newBuilding={
    BU_Id: uuidv4(),
    BU_Name: req.body.BuildingName,
    StreetId: req.body.StreetId
  }
  BU.create(newBuilding)
  res.json({id: newBuilding.BU_Id})
})


//@desc create new apartment
router.post('/createBuilding', ensureAuth, (req, res) => {
  const newApartment={
    APA_Id: uuidv4(),
    BU_Id: req.body.buildingId,
    StreetId: req.body.StreetId,
    APA_Name: req.body.apartamentName
  }
  APA.create(newApartment)
  res.json({id: newApartment.APA_Id})
})



//@desc create new apartment post
router.post('/createApartmentPost', ensureAuth, (req, res) => {
  const newAppartmentPost={
    PostId: uuidv4(),
    UserId: req.body.userID,
    APA_Id : req.body.apartamentID,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    APA_Text: req.body.apartamentText,
    APA_rank: req.body.rank,
    rentCost: req.body.rentCost,
    heshbonot: req.body.heshbonot,
  }
  APA_Post.create(newAppartmentPost)
  res.json({id: newAppartmentPost.PostId})
})


//@desc create new building post
router.post('/createBuildingPost', ensureAuth, (req, res) => {
  const newBuildingPost={
    PostId: uuidv4(),
    UserId: req.body.userId,
    BU_Id: req.body.buildingId,
    apartamentID : req.body.apartamentID,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    BU_Students: req.body.levelOfStudents,
    BU_Text: req.body.buildingText,
    BU_rank: req.body.buildingRank,
  }
  BU_Post.create(newBuilding)
  res.json({id: newBuildingPost.PostId})
})

















//@desc login/landing
router.get('/JsonOfAllStreets', ensureAuth, (req, res) => {
  res.json([{
    name: "צ'רניכובסקי",
    id: 2040135469834
  }, {
    name: `חז"ל`,
    id: 1930135469834
  }])
})

//@desc login/landing
//@route GET /
router.get('/JsonOfAllBuilding', ensureAuth, (req, res) => {
  const steetId = req.body.streetId;
  res.json([{
    name: `1`,
    id: 2440135469834
  }, {
    name: "2ב",
    id: 1937135469834
  }])
})

//@desc login/landing
//@route GET /
router.get('/JsonOfAllApartments', ensureAuth, (req, res) => {
  const buldingId = req.body.streetId;
  res.json([{
    name: `1`,
    id: 2056135469834
  }, {
    name: `2`,
    id: 1930879469834
  }])
})

//@desc login/landing
//@route GET /
router.get('/JsonOfAllComments', ensureAuth, (req, res) => {
  const appartamentId = req.body.appartmentId;
  res.json({
    apartmentComments: [{
      apartamentID: 1937135469834,
      postID: 1937135469834,
      startYear: 2019,
      endYear: 2020,
      apartamentText: "היה ממש בסדר האמתר שום דבר חשוד",
      rank: 8,
      rentCost: 2500,
      heshbonot: 450
    }, ],
    buildingComments: [{
      buildingId: 1937135469834,
      levelOfStudents: 3,
      buildingText: "יש משאית זבל ששומעים בבוקר, חוץ מזה כלום",
      buildingRank: 6
    }]
  })
})



module.exports = router
