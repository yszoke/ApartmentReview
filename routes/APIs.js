const express = require("express")
const router = express.Router()
const {  ensureAuth , ensureAdmin } = require('../middleware/auth')
const uuidv4 = require ('uuid').v4 //uuidv4();
const Street = require('../models/Street')
const BU = require('../models/BU')
const APA = require('../models/APA')
const BU_Post = require('../models/BU_post')
const APA_Post = require('../models/APA_post')
const User = require('../models/User')
const { Error } = require("mongoose")



//only for development
router.post("/load", ensureAuth, ensureAdmin, async (req , res)=>{
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
      ST_Id:uuidv4(),
      DB_Name: streets[i],
      Buildings: {}
    }
    const exsist = await Street.findOne({ DB_Name: newO.DB_Name})
    if(!exsist){
      await Street.create(newO)
      console.log(newO)
    }
    console.log(i)
  }
  res.send("done")
})

const errorHandler=(err , name , code)=>{
  if(!name) {return res.json({code: error.code, name:error.name})}
  return res.json({code: code, name:name})
}


///////////////////////////////
/*     End Points            */
///////////////////////////////


//////////////////          CREATE            ///////////////////////////

//@desc create new street  //isChanged V //missingChackedReturn V //tryCatchreturn v
router.post('/createStreet', ensureAuth, ensureAdmin, async (req , res)=>{
  if (!req.body.streetName){errorHandler(null,"server","req.body.streetName is missing"); return;}
  const newStreet = {
    ST_Id:uuidv4(),
    DB_Name: req.body.streetName,
    DB_Buildings:[]
  }
  try {
    await Street.create(newStreet)
  } catch (error) {
    errorHandler(error)
    return;
  }
  res.json({id: newStreet.ST_Id})
})


//@desc create new building //isChanged V  //missingChackedReturn V  //tryCatchreturn v
router.post('/createBuilding', ensureAuth, async (req, res) => {
  if ( !req.body.buildingName){errorHandler(null,"server"," req.body.buildingName is missing"); return;}
  if ( !req.body.streetId){errorHandler(null,"server","req.body.streetId is missing"); return;}
  const newBuilding={
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Id: await uuidv4(),
    BU_Name: req.body.buildingName,
    ST_Id: req.body.streetId,
    DB_Apartments : [],
  }
  try{ await BU.create(newBuilding)  }catch(error){errorHandler(error);return;}
  try{ await Street.findOneAndUpdate({ST_Id:newBuilding.ST_Id}, {$push: {DB_Buildings: {
    Id: newBuilding.BU_Id,
    Name: newBuilding.BU_Name
  }}}) }catch(error){errorHandler(error); return}
  res.json({id: newBuilding.BU_Id})
})


//@desc create new apartment //isChanged V  //missingChackedReturn V  //tryCatchreturn V
router.post('/createApartment', ensureAuth, async (req, res) => { 
  if ( !req.body.buildingId){errorHandler(null,"server","req.body.buildingId is missing"); return;}
  if ( !req.body.streetId){errorHandler(null,"server","req.body.streetId is missing"); return;}
  if ( !req.body.apartmentName){errorHandler(null,"server","req.body.apartmentName is missing"); return;}
  const newApartment={
    APA_Id: uuidv4(),
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Id: req.body.buildingId,
    ST_Id: req.body.streetId,
    APA_Name: req.body.apartmentName
  }
  try{ await APA.create(newApartment) }catch(error){errorHandler(error); return}
  try{ await BU.findOneAndUpdate({BU_Id:newApartment.BU_Id}, {$push: { DB_Apartments:{
    Id: newApartment.APA_Id,
    Name: newApartment.APA_Name
  }}})}catch(error){errorHandler(error); return}
  res.json({id: newApartment.APA_Id})
})


//@desc create new apartment post //isChanged V //missingChackedReturn V /tryCatchreturn V
router.post('/createApartmentPost', ensureAuth, async (req, res) => {
  let missings =""
  const newAppartmentPost={
    Post_Id: uuidv4(),
    User_Id: req.user.userId,
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    APA_Id : (req.body.apartamentId ? (req.body.apartamentId) : (missings+="apartamentId " , null)),
    S_Year: (req.body.startYear ? (req.body.startYear) : (missings+="startYear " , null) ),
    E_Year: (req.body.endYear ? (req.body.endYear) : (missings+="endYear" , null)),
    APA_Text: (req.body.apartamentText ? (req.body.apartamentText) : (missings+="apartamentText " , null)),
    APA_rank: (req.body.rank ? (req.body.rank) : (missings+="rank " , null)),
    Cost: (req.body.rentCost ? (req.body.rentCost ) : (missings+="rentCost " , null)),
    bills: (req.body.heshbonot ? (req.body.heshbonot) : (missings+="heshbonot " , null)),
  }
  if(missings!=""){
    errorHandler(null , "server" , "missing fields: : "+missings);
    return;
  }

  try{ await APA_Post.create(newAppartmentPost) }catch(error){errorHandler(error); return;}
  res.json({id: newAppartmentPost.Post_Id})
})


//@desc create new building post //isChanged V  //missingChackedReturn V //tryCatchreturn 
router.post('/createBuildingPost', ensureAuth, async (req, res) => { 
  let missings =""
  const newBuildingPost={
    Post_Id: uuidv4(),
    User_Id: req.user.userId,
    CreatorsGoogleID : req.user.googleId,//for security ONLY
    BU_Id: (req.body.buildingId ? (req.body.buildingId) : (missings+="buildingId " , null)),
    APA_Id : (req.body.apartamentId ? (req.body.apartamentId) : (missings+="apartamentId " , null)),
    S_Year: (req.body.startYear ? (req.body.startYear) : (missings+="startYear " , null)),
    E_Year: (req.body.endYear ? (req.body.endYear) : (missings+="endYear " , null)),
    BU_Students: (req.body.levelOfStudents ? (req.body.levelOfStudents) : (missings+="levelOfStudents " , null)),
    BU_Text: (req.body.buildingText ? (req.body.buildingText) : (missings+="buildingText " , null)),
    BU_rank: (req.body.buildingRank ? (req.body.buildingRank) : (missings+="buildingRank " , null)),
  }
  if(missings!=""){errorHandler(null , "server" , "missing fields: "+missings); return;}
  try{ await BU_Post.create(newBuilding) }catch(error){errorHandler(error); return;}
  res.json({id: newBuildingPost.Post_Id})
})


//////////////////          READ            ///////////////////////////

//@desc post all streets //isChanged V //tryCatchreturn v
router.post('/getAllStreets', ensureAuth, async (req , res)=>{   
  try{
    const DB_Streets = await Street.find({},{_id:0, DB_Buildings:0})//ST_Id: 1  DB_Name: 1
  }catch(error){
    errorHandler(error)
    return
  }
  let API_Streets = []
  console.log(DB_Streets)
  await DB_Streets.forEach((element)=>{
    API_Streets.push({
      Id: element.ST_Id,
      streetName: element.DB_Name
    })
  })
  res.json(API_Streets)
})


//@desc post all buildings in a street  //isChanged - no need  //tryCatchreturn V
router.post('/getBuildings', ensureAuth, async (req, res) => {
  if(!req.body.StreetId){ 
    errorHandler(null , "server" ,"missing fields: StreetId")
    return
  }
  try { const street = await Street.findOne({ST_Id:req.body.StreetId},{
    _id:0,
    CreatorsGoogleID: 0,
    Id:0,
    Name:0
    //DB_Buildings:1
  }) }catch(error){
    errorHandler(error)
    return
  }
  res.json(DB_buildings.DB_Buildings)
})


//@desc post all apartments in a Building  //isChanged - no need  //tryCatchreturn V
router.post('/getApartments', ensureAuth, async (req, res) => {
  if(!req.body.BuildingId){ 
    errorHandler(null , "server" ,"missing fields: BuildingId")
    return
  }
  try{ 
    const building = await BU.find({BU_Id : req.body.BuildingId},
  { 
    _id:0,
    CreatorsGoogleID: 0,
    BU_Name: 0,
    BU_Id:0,
    ST_Id:0,
    // DB_Apartments: 1
  })
}catch(error){
  errorHandler(error)
  return
}
  res.json(building.DB_Apartments)
})


//@desc post all apartment posts for an apartment //isChanged V  //tryCatchreturn V
router.post('/getApartmentPosts', ensureAuth, async (req, res) => {
  if(!req.body.ApartmentId){ 
    errorHandler(null , "server" ,"missing fields: ApartmentId")
    return
  }
  try {
    const DB_ApartmentPosts = await APA_Post.find({APA_Id: req.body.ApartmentId},
    {
      _id: 0,
      CreatorsGoogleID: 0,
      // Post_Id:1, 
      User_Id: 0,
      APA_Id: 0,
      // S_Year:1,
      // E_Year:1,
      // APA_Text:1,
      // APA_rank:1,
      // Cost:1,
      // bills:1
    })
  } catch (error) {
    errorHandler(error)
    return
  }
  let API_ApartmentPosts = []
  DB_ApartmentPosts.forEach((element) => {
    API_ApartmentPosts.push({
      postId: element.Post_Id,
      startYear: element.S_Year,
      endYear: element.E_Year,
      apartamentText: element.APA_Text,
      rank: element.APA_rank,
      rentCost: element.Cost,
      heshbonot: element.bills
    })
  })
  res.json(API_ApartmentPosts)
})


//@desc post all building post for a building
router.post('/getBuildingPosts', ensureAuth, async(req, res) => {
  if(!req.body.BuildingId){ 
    errorHandler(null , "server" ,"missing fields: BuildingId")
    return
  }
  try{ const DB_BuildingPosts = await BU_Post.find({BU_Id: req.body.BuildingId},{
    _id:0,
    CreatorsGoogleID: 0,
    // Post_Id: 1,
    User_Id: 0,
    BU_Id: 0,
    APA_Id : 0,
    // S_Year: 1,
    // E_Year: 1,
    // BU_Students: 1,
    // BU_Text: 1,
    // BU_rank: 1 
  }) }catch(error){
    errorHandler(error)
    return
  }
  let API_BuildingPosts = []
  DB_BuildingPosts.forEach((element) => {
    API_BuildingPosts.push(
    {
      postId: element.Post_Id,
      startYear: element.S_Year,
      endYear: element.E_Year,
      apartamentText: element.APA_Text,
      rank: element.APA_rank,
      levelOfStudents: element.BU_Students,
      buildingText: element.BU_Text,
      buildingRank: element.BU_rank
    })
  })
  res.json(API_BuildingPosts)
})


//@desc post all apartment posts that belongs to a user
router.post('/getMyApartmentPosts', ensureAuth, async (req, res) => {
  if(!req.body.userId){ 
    errorHandler(null , "server" ,"missing fields: userId")
    return
  }
  try {const DB_ApartmentPosts = await APA_Post.find({User_Id: req.user.userId},
  {
    _id: 0,
    CreatorsGoogleID: 0,
    // Post_Id:1, 
    User_Id: 0,
    // APA_Id: 1,
    // S_Year:1,
    // E_Year:1,
    // APA_Text:1,
    // APA_rank:1,
    // Cost:1,
    // bills:1
  }) }catch(error){
    errorHandler(error)
    return
  }
  let API_ApartmentPosts = []
  DB_ApartmentPosts.forEach((element) => {
    API_ApartmentPosts.push(
    {
      postId: element.Post_Id,
      apartamentId: element.APA_Id,
      startYear: element.S_Year,
      endYear: element.E_Year,
      apartamentText: element.APA_Text,
      rank: element.APA_rank,
      rentCost: element.Cost,
      heshbonot: element.bills
    })
  })
  res.json(API_ApartmentPosts)
})


//@desc post all building post that belongs to a user
router.post('/getMyBuildingPosts', ensureAuth, async(req, res) => {
  if(!req.body.userId){ 
    errorHandler(null , "server" ,"missing fields: userId")
    return
  }
  try{ const DB_BuildingPosts = await BU_Post.find({User_Id: req.user.userId},{
    _id:0,
    CreatorsGoogleID: 0,
    // Post_Id: 1,
    User_Id: 0,
    // BU_Id: 1,
    APA_Id : 0,
    // S_Year: 1,
    // E_Year: 1,
    // BU_Students: 1,
    // BU_Text: 1,
    // BU_rank: 1 
  })}catch(error){
    errorHandler(error)
    return
  }
  let API_BuildingPosts = []
  DB_BuildingPosts.forEach((element) => {
    API_BuildingPosts.push(
    {
      postId: element.Post_Id,
      buildingId: element.BU_Id,
      startYear: element.S_Year,
      endYear: element.E_Year,
      apartamentText: element.APA_Text,
      rank: element.APA_rank,
      levelOfStudents: element.BU_Students,
      buildingText: element.BU_Text,
      buildingRank: element.BU_rank
    })
  })
  res.json(API_BuildingPosts)
})


//////////////////          UPDATE            ///////////////////////////

//@desc update apartment post only if authonticated user id is muching the post id
router.post('/updateApartmentPost' , ensureAuth , async (req , res) => {
  let missings =""
  if(!req.body.IdOfPost) missings+="IdOfPost "
  const newAppartmentPost={
    S_Year: (req.body.startYear ? (req.body.startYear) : (missings+="startYear " , null) ),
    E_Year: (req.body.endYear ? (req.body.endYear) : (missings+="endYear" , null)),
    APA_Text: (req.body.apartamentText ? (req.body.apartamentText) : (missings+="apartamentText " , null)),
    APA_rank: (req.body.rank ? (req.body.rank) : (missings+="rank " , null)),
    Cost: (req.body.rentCost ? (req.body.rentCost ) : (missings+="rentCost " , null)),
    bills: (req.body.heshbonot ? (req.body.heshbonot) : (missings+="heshbonot " , null)),
  }
  if(missings!=""){
    errorHandler(null , "server" , "missing fields: "+missings);
    return;
  }
  try {
    const isAuthorized = await APA_Post.findOne({Post_Id : req.body.IdOfPost}).userId == req.user.userId
  }catch(error){
    errorHandler(error)
    return
  }
  if(isAuthorized){
    try {
      await APA_Post.findOneAndUpdate(
        { Post_Id: req.body.IdOfPost },
        { $set: newAppartmentPost }
      )
    }catch(error){
      errorHandler(error)
      return
    }
    res.json({
      id : req.body.IdOfPost
    })
  }else{
    errorHandler(null, "server" , "not The Post Owner")
  }
})


//@desc update building post only if authonticated user id is muching the post id
router.post('/updateBuildingPost', ensureAuth, async (req, res) => {
  let missings =""
  if(!req.body.IdOfPost) missings += "IdOfPost "
  const updatedBuildingPost={
    S_Year: (req.body.startYear ? (req.body.startYear) : (missings += "startYear ", null)),
    E_Year: (req.body.endYear ? (req.body.endYear) : (missings += "endYear ", null)),
    BU_Students: (req.body.levelOfStudents ? (req.body.levelOfStudents) : (missings += "levelOfStudents ", null)),
    BU_Text: (req.body.buildingText ? (req.body.buildingText) : (missings += "buildingText ", null)),
    BU_rank: (req.body.buildingRank ? (req.body.buildingRank) : (missings += "buildingRank ", null)),
  }
  if(missings!=""){errorHandler(null , "server" , "missing fields: "+missings); return;}
  try { const isAuthorized = await BU_Post.findOne({Post_Id: req.body.IdOfPost}).userId == req.user.userId} catch (error) {
    errorHandler(error)
    return
  }
  if (isAuthorized) {
    try {
      await BU_Post.findOneAndUpdate({Post_Id: req.body.IdOfPost},
        {$set: updatedBuildingPost})
    } catch (error) {
      errorHandler(error)
      return
    }
    res.json({
      id : req.body.IdOfPost
    })
  } else {
    errorHandler(null, "server", "not The Post Owner")
  }
})


//////////////////          DELETE            ///////////////////////////

//@desc delet post by post id only if userId is muching
router.post('/deleteApartmentPost' , ensureAuth , async (req , res) => {
  if(!req.body.IdOfPost){ 
    errorHandler(null , "server" ,"missing fields: IdOfPost")
    return
  }
  try { const isAuthorized = await APA_Post.findOne({Post_Id : req.body.IdOfPost}).userId == req.user.userId
  }catch (error) {
    errorHandler(error)
    return
  }
  if (isAuthorized) {
    try {
      await APA_Post.findOneAndDelete({Post_Id : req.body.IdOfPost})
      res.json({id : req.body.IdOfPost})
    } catch (error) {
      errorHandler(error)
      return
    }
  } else {
    errorHandler(null, "server", "notThePostOwner")
  }
})


//@desc delet post by post id only if userId is muching
router.post('/deleteBuildingPost', ensureAuth, async (req, res) => {
  if(!req.body.IdOfPost){ 
    errorHandler(null , "server" ,"missing fields: IdOfPost")
    return
  }
  try {const isAuthorized = await BU_Post.findOne({Post_Id: req.body.IdOfPost}).userId == req.user.userId} catch (error) {errorHandler(error)}
  if (isAuthorized) {
    try {
      await BU_Post.findOneAndDelete({
        Post_Id: req.body.IdOfPost
      })
      res.json({
        id: req.body.IdOfPost
      })
    } catch (error) {
      errorHandler(error)
      return
    }
  } else {
    errorHandler(null, "server", "notThePostOwner")
  }
})























//@desc login/landing
router.post('/JsonOfAllStreets', ensureAuth, (req, res) => {
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
router.post('/JsonOfAllBuilding', ensureAuth, (req, res) => {
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
router.post('/JsonOfAllApartments', ensureAuth, (req, res) => {
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
router.post('/JsonOfAllComments', ensureAuth, (req, res) => {
  const apartamentId = req.body.apartmentId;
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
