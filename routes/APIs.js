const express = require("express")
const router = express.Router()
const {  ensureAuth } = require('../middleware/auth')
const uuidv4 = require ('uuid').v4 //uuidv4();
const Street = require('../models/Street')
const BU = require('../models/BU')
const APA = require('../models/APA')
const BU_Post = require('../models/BU_post')
const APA_Post = require('../models/APA_post')
const User = require('../models/User')


//only for development
router.get("/load", ensureAuth, async (req , res)=>{
  const streets=['אביה השופט',
  'אברהם אבינו',
  'אוסבלדו ארניה',
  'איינשטיין',
  'אל זיסו',
  'אליעזר בן יהודה',
  'אלכסנדר ינאי',
  'אלעד בן יאיר',
  'אסף הרופא',
  'ארלוזרוב',
  'בנימין מטודלה',
  'בצלאל',
  'ברנפלד',
  'גבעתי',
  'גולונב',
  'גולני',
  'גוש עציון',
  'גרץ',
  'דובנוב',
  'דוד המלך',
  'דרך השלום',
  'דרך מצדה',
  'הוברמן',
  'הכוזרי',
  'הנדיב',
  'הקנאים',
  'הרב יוסף סוסו הכהן',
  'הרב שמחה אסף',
  'וינגייט',
  'זלמן שניאור',
  'חביבה רייק',
  'חומה ומגדל',
  'חז"ל',
  'חיבת ציון',
  'חיים הזז',
  'חיים נחמן ביאליק',
  'חנה סנש',
  'טשרניחובסקי',
  'יוחנן הורקנוס',
  'יוטבתה',
  'יוסף בן מתיתיהו',
  'יוסף קלאוזנר',
  'יעקב אבינו',
  'יעקב כהן',
  'יצחק אבינו',
  'יצחק למדן',
  'כיכר הקניזי',
  'כרמלי',
  'ליאונרד ברנשטיין',
  'מנדלסון',
  'משעול אבן גבירול',
  'משעול דבורה בארון',
  'משעול לאה גולדברג',
  'משעול רחל',
  'ניל"י',
  'סמטת צקלג',
  'סעדיה גאון',
  'עוזיהו המלך',
  'פרויד',
  'פרן',
  'צביה השופט',
  'צין',
  'קדש',
  'קלישר',
  'קלישר',
  'קרייתי',
  'רבי טרפון',
  'רבי עקיבא',
  'רזיאל',
  'רחוב',
  'רינגלבלום',
  'רמחל',
  'שדרות דוד בן גוריון',
  'שועלי שמשון',
  'שטרוק',
  'שלום עליכם',
  'שלמה המלך',
  'שמעון בר גיורא',
  'שמעוני',
  'שרעבי',
  'שדרות יצחק רגר',
  ]

  for(let i=0; i<streets.length; i++){
    const newO={
      Id:uuidv4(),
      Name: streets[i],
      Buildings: {}
    }
    const exsist = await Street.findOne({ Name: newO.Name})
    if(!exsist){
      await Street.create(newO)
      console.log(newO)
    }
    console.log(i)
  }
  res.send("done")
})


///////////////////////////////
/*     End Points            */
///////////////////////////////

//////////////////          POST            ///////////////////////////

//@desc create new street
router.post('/createStreet', ensureAuth, async (req , res)=>{
  const newStreet = {
    Id:uuidv4(),
    Name: req.body.streetName,
    Buildings:[]
  }
  if(req.body.paswword == process.env.adminPaswword) await Street.create(newStreet)  
  res.json({id: newStreet.Id})
})


//@desc create new building
router.post('/createBuilding', ensureAuth, async (req, res) => {
  const newBuilding={
    BU_Id: uuidv4(),
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Name: req.body.BuildingName,
    StreetId: req.body.StreetId,
    Apartments : [],
    user

  }
  await BU.create(newBuilding)
  await Street.findByIdAndUpdate({Id:newBuilding.StreetId}, {$push: {Buildings: {
    Id: newBuilding.BU_Id,
    Name: newBuilding.BU_Name
  }}})
  res.json({id: newBuilding.BU_Id})
})


//@desc create new apartment
router.post('/createApartment', ensureAuth, async (req, res) => {
  const newApartment={
    APA_Id: uuidv4(),
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Id: req.body.buildingId,
    StreetId: req.body.StreetId,
    APA_Name: req.body.apartamentName
  }
  await APA.create(newApartment)
  await BU.findByIdAndUpdate({Id:newApartment.StreetId}, {$push: { Apartments:{
    Id: newApartment.APA_Id,
    Name: newApartment.APA_Name
  }}})
  res.json({id: newApartment.APA_Id})
})


//@desc create new apartment post
router.post('/createApartmentPost', ensureAuth, async (req, res) => {
  const newAppartmentPost={
    PostId: uuidv4(),
    UserId: req.body.userId,
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    APA_Id : req.body.apartamentID,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    APA_Text: req.body.apartamentText,
    APA_rank: req.body.rank,
    rentCost: req.body.rentCost,
    heshbonot: req.body.heshbonot,
  }
  await APA_Post.create(newAppartmentPost)
  res.json({id: newAppartmentPost.PostId})
})


//@desc create new building post
router.post('/createBuildingPost', ensureAuth, async (req, res) => {
  const newBuildingPost={
    PostId: uuidv4(),
    UserId: req.body.userId,
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Id: req.body.buildingId,
    apartamentID : req.body.apartamentID,
    startYear: req.body.startYear,
    endYear: req.body.endYear,
    BU_Students: req.body.levelOfStudents,
    BU_Text: req.body.buildingText,
    BU_rank: req.body.buildingRank,
  }
  await BU_Post.create(newBuilding)
  res.json({id: newBuildingPost.PostId})
})



//////////////////          GET            ///////////////////////////



//@desc get all streets
router.get('/getAllStreets', ensureAuth, async (req , res)=>{  
  res.json(await Street.find({},{_id:0, Buildings:0}))// Id:1, Name:1
})


//@desc get all buildings in a street
router.get('/getBuildings', ensureAuth, async (req, res) => {
  res.json(await Street.find({Id:req.body.StreetId},{_id:0, CreatorsGoogleID: 0, Id:0, Name:0})) //Buildings:1
})


//@desc get all apartments in a Building
router.post('/getApartments', ensureAuth, async (req, res) => {
  res.json(await BU.find({BU_Id : req.body.BuildingId},{ 
    _id:0,
    CreatorsGoogleID: 0,
    BU_Name: 0,
    BU_Id:0,
    StreetId:0,
    // Apartments: 1
  }))
})


//@desc get all apartment posts for an apartment
router.get('/getApartmentPosts', ensureAuth, async(req, res) => {
  res.json(await APA_Post.find({APA_Id:req.body.ApartmentId},{
    _id:0,
    CreatorsGoogleID: 0,
    // PostId:1, 
    UserId:0,
    APA_Id:0,
    // startYear:1,
    // endYear:1,
    // APA_Text:1,
    // APA_rank:1,
    // rentCost:1,
    // heshbonot:1
  }))
})


//@desc get all building post for a building
router.get('/getBuildingPosts', ensureAuth, async(req, res) => {
  BU_Post.create(newBuilding)
  res.json(await BU_Post.find({BU_Id: req.body.BuildingId},{
    _id:0,
    CreatorsGoogleID: 0,
    // PostId: 1,
    UserId: 0,
    BU_Id: 0,
    apartamentID : 0,
    // startYear: 1,
    // endYear: 1,
    // BU_Students: 1,
    // BU_Text: 1,
    // BU_rank: 1 
  }))
})


//////////////////          update            ///////////////////////////

router.put('/updateBU_Post' , ensureAuth , async (req , res) => {
  if(await APA_Post.findOne({PostId : req.body.IdOfPost}).userId == req.user.userId){
    await APA_Post.update(
      { PostId : req.body.IdOfPost },
      { $set:
         {
          startYear: req.body.startYear,
          endYear: req.body.endYear,
          APA_Text: req.body.apartamentText,
          APA_rank: req.body.rank,
          rentCost: req.body.rentCost,
          heshbonot: req.body.heshbonot,
         }
      }
   )
  }
})

router.put('/updateBU_Post' , ensureAuth , async (req , res) => {
  if(await BU_Post.findOne({PostId : req.body.IdOfPost}).userId == req.user.userId){
    await BU_Post.update(
      { PostId : req.body.IdOfPost },
      { $set:
         {
          startYear: req.body.startYear,
          endYear: req.body.endYear,
          BU_Students: req.body.levelOfStudents,
          BU_Text: req.body.buildingText,
          BU_rank: req.body.buildingRank,
         }
      }
   )
  }
})


//////////////////          delet            ///////////////////////////

//@desc delet post by post id only if userId is muching

router.delete('/updateBU_Post' , ensureAuth , async (req , res) => {
  if(await APA_Post.findOne({PostId : req.body.IdOfPost}).userId == req.user.userId){
    await APA_Post.findOneAndDelete({PostId : req.body.IdOfPost})
  }
})

router.delete('/updateBU_Post' , ensureAuth , async (req , res) => {
  if(await BU_Post.findOne({PostId : req.body.IdOfPost}).userId == req.user.userId){
    await BU_Post.findOneAndDelete({PostId : req.body.IdOfPost})
  }
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
