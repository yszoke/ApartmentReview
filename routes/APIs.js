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
const { session } = require("passport")
const { validate } = require("uuid")



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

///////////////////////////////
/*     End Points            */
///////////////////////////////


//////////////////          CREATE            ///////////////////////////

//@desc create new street  //isChanged V //missingChackedReturn V //tryCatchreturn v
router.post('/createStreet', ensureAuth, ensureAdmin, async (req, res) => {
  const reqInfo = {
    DB_Name: ["streetName", null, justReturnBack],
  }
  const addings = {
    ST_Id: uuidv4(),
    DB_Buildings: []
  }
  try {
    const dataObject = dataObjectCreator (req , res , reqInfo , addings)  
    if(!dataObject){return}
    await Street.create(dataObject)
    res.json({id: dataObject.ST_Id})
  } catch (error) {errorHandler(res, error)}
})

//@desc create new building //isChanged V  //missingChackedReturn V  //tryCatchreturn v
router.post('/createBuilding', ensureAuth, async (req, res) => {
  const reqInfo = {
    BU_Name: ["buildingName", null, justReturnBack],
    ST_Id: ["streetId", null, justReturnBack],
  }
  const addings = {
    CreatorsGoogleID: req.user.googleId, //for security ONLY
    BU_Id: await uuidv4(),
    DB_Apartments: [],
  }
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    await BU.create(dataObject)
    await Street.findOneAndUpdate({
      ST_Id: dataObject.ST_Id
    }, {
      $push: {
        DB_Buildings: {
          Id: dataObject.BU_Id,
          Name: dataObject.BU_Name
        }
      }
    })
    res.json({
      id: dataObject.BU_Id
    })
  } catch (error) {
    errorHandler(res, error);
    return;
  }
})

//@desc create new apartment //isChanged V  //missingChackedReturn V  //tryCatchreturn V
router.post('/createApartment', ensureAuth, async (req, res) => {
  const reqInfo = {
    BU_Id: ["buildingId", null, justReturnBack],
    ST_Id: ["streetId", null, justReturnBack],
    APA_Name: ["apartmentName", null, justReturnBack],
  }
  const addings = {
    APA_Id: uuidv4(),
    CreatorsGoogleID: req.user.googleId, //for security ONLY
  }
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    await APA.create(dataObject)
    await BU.findOneAndUpdate({
      BU_Id: dataObject.BU_Id
    }, {
      $push: {
        DB_Apartments: {
          Id: dataObject.APA_Id,
          Name: dataObject.APA_Name
        }
      }
    })
    res.json({
      id: dataObject.APA_Id
    })
  } catch (err) {
    errorHandler(res, err)
  }
})

//@desc create new apartment post //isChanged V //missingChackedReturn V /tryCatchreturn V
router.post('/createApartmentPost', ensureAuth, async (req, res) => {

  const reqInfo = {
    S_Year: ["startYear", yearValidate, toIntOrNull],
    E_Year: ["endYear", yearValidate, toIntOrNull],
    APA_Id: ["levelOfStudents", null, justReturnBack],
    APA_Text: ["buildingText", null, justReturnBack],
    APA_rank: ["buildingRank", OneToFiveValidate, toIntOrNull],
    Cost: ["buildingRank", null, toIntOrNull],
    bills: ["buildingRank", null, toIntOrNull],
  }
  const addings = {
      Post_Id: uuidv4(),
      User_Id: req.user.userId,
      CreatorsGoogleID : req.user.googleId,//for security ONLY
  }
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    await APA_Post.create(dataObject) 
    res.json({id: dataObject.Post_Id})
  } catch (err) {
    errorHandler(res, err)
  }

  // try{ 
  //   let user=await User.findOne({userId:req.user.userId})
  //   if(isSameYears(user.aciveYears, req.body.startYear , req.body.endYear)){
  //     await User.findOneAndUpdate({userId:req.user.userId},{
  //       $pushAll: {Year:extreamsToRange(req.body.startYear,req.body.endYear)}
  //     })
  //   }else{
  //     errorHandler(res, null,"server","two posts in one year")
  //   }
  // }catch(error){errorHandler( res , error); return}

})

//@desc create new building post //isChanged V  //missingChackedReturn V //tryCatchreturn 
router.post('/createBuildingPost', ensureAuth, async (req, res) => {
  const reqInfo = {
    BU_Id: ["buildingId", null, justReturnBack],
    APA_Id: ["apartmentId", null, justReturnBack],
    S_Year: ["startYear", yearValidate, toIntOrNull],
    E_Year: ["endYear", yearValidate, toIntOrNull],
    BU_Students: ["levelOfStudents", OneToFiveValidate, toIntOrNull],
    BU_Text: ["buildingText", null, justReturnBack],
    BU_rank: ["buildingRank", OneToFiveValidate, toIntOrNull],
  }
  const addingds = {
    Post_Id: uuidv4(),
    User_Id: req.user.userId,
    CreatorsGoogleID: req.user.googleId, //for security ONLY
  }
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {
      return
    }
    await BU_Post.create(dataObject)
    res.json({
      id: dataObject.Post_Id
    })
  } catch (err) {
    errorHandler(res, err)
  }
})


//////////////////          READ            ///////////////////////////

//@desc post all streets //isChanged V //tryCatchreturn v
router.post('/getAllStreets', ensureAuth, async (req , res)=>{   
  try{
    let API_Streets = []
    let DB_Streets = await Street.find({},{_id:0, DB_Buildings:0})//ST_Id: 1  DB_Name: 1
    console.log("getAllStreets")
    await DB_Streets.forEach((element)=>{
      API_Streets.push({
        Id: element.ST_Id,
        streetName: element.DB_Name
      })
    })
    res.json(API_Streets)
  }catch(error){
    errorHandler( res , error)
  }
})

//@desc post all buildings in a street  //isChanged - no need  //tryCatchreturn V
router.post('/getBuildings', ensureAuth, async (req, res) => {
  try { 
    if(!req.body.StreetId){ 
      errorHandler( res , "missing fields: StreetId")
      return
    }
    let street = await Street.findOne({ST_Id:req.body.StreetId},{
      _id:0,
      CreatorsGoogleID: 0,
      Id:0,
      Name:0
      //DB_Buildings:1
    })
    res.json(street.DB_Buildings)
  }catch(error){
    errorHandler( res , error)
  }
})

//@desc post all apartments in a Building  //isChanged - no need  //tryCatchreturn V
router.post('/getApartments', ensureAuth, async (req, res) => {
  try {
    if (!req.body.buildingId) {
      errorHandler(res, "missing fields: buildingId")
      return
    }
    let building = await BU.findOne({
      BU_Id: req.body.buildingId
    }, {
      _id: 0,
      CreatorsGoogleID: 0,
      BU_Name: 0,
      BU_Id: 0,
      ST_Id: 0,
      // DB_Apartments: 1
    })
    res.json(building.DB_Apartments) //צריך לעדכן את בדיקה שלא קיימים דירות ב
  } catch (error) {
    errorHandler(res, error)
  }
})

//@desc post all apartment posts for an apartment //isChanged V  //tryCatchreturn V
router.post('/getApartmentPosts', ensureAuth, async (req, res) => {
  try {
    if(!req.body.apartmentId){ 
      errorHandler( res ,"missing fields: apartmentId")
      return
    }
    let DB_ApartmentPosts = await APA_Post.find({APA_Id: req.body.apartmentId},
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
  } catch (error) {
    errorHandler( res , error)
    return
  }
})

//@desc post all building post for a building
router.post('/getBuildingPosts', ensureAuth, async(req, res) => {
  let DB_BuildingPosts = []
  let API_BuildingPosts = []
  if(!req.body.buildingId){ 
    errorHandler( res , "missing fields: buildingId")
    return
  }
  try{ DB_BuildingPosts = await BU_Post.find({BU_Id: req.body.buildingId},{
    _id:0,
    CreatorsGoogleID: 0,
    // Post_Id: 1,
    User_Id: 0,
    BU_Id: 0,
    APA_Id : 0,
    // S_Year:1,
    // E_Year: 1,
    // BU_Students: 1,
    // BU_Text: 1,
    // BU_rank: 1 
  }) }catch(error){
    errorHandler( res , error)
    return
  }
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
  let DB_ApartmentPosts=[]
  let API_ApartmentPosts = []
  try {DB_ApartmentPosts = await APA_Post.find({User_Id: req.user.userId},
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
    errorHandler( res , error)
    return
  }
  DB_ApartmentPosts.forEach((element) => {
    API_ApartmentPosts.push(
    {
      postId: element.Post_Id,
      apartmentId: element.APA_Id,
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
  let DB_BuildingPosts = []
  let API_BuildingPosts = []
  try{ DB_BuildingPosts = await BU_Post.find({User_Id: req.user.userId},{
    _id:0,
    CreatorsGoogleID: 0,
    // Post_Id: 1,
    User_Id: 0,
    // BU_Id: 1,
    APA_Id : 0,
    // S_Year:1,
    // E_Year: 1,
    // BU_Students: 1,
    // BU_Text: 1,
    // BU_rank: 1 
  })}catch(error){
    errorHandler( res , error)
    return
  }
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
  let isOwner = null
  let sameYear = null
  if(!req.body.IdOfPost) missings+="IdOfPost "
  const newAppartmentPost={
    S_Year: (yearValidate(req.body.startYear) ? (req.body.startYear) : (missings+="startYear " , null) ),
    E_Year: (yearValidate(req.body.endYear) ? (req.body.endYear) : (missings+="endYear" , null)),
    APA_Text: (req.body.apartamentText ? (req.body.apartamentText) : (missings+="apartamentText " , null)),
    APA_rank: (req.body.rank ? (req.body.rank) : (missings+="rank " , null)),
    Cost: (req.body.rentCost ? (req.body.rentCost ) : (missings+="rentCost " , null)),
    bills: (req.body.heshbonot ? (req.body.heshbonot) : (missings+="heshbonot " , null)),
  }
  if(missings!=""){
    errorHandler( res , null , "server" , "missing fields: "+missings);
    return;
  }
  try {
    let before = await APA_Post.findOne({Post_Id : req.body.IdOfPost})
    isOwner = (before.userId == req.user.userId)
    sameYear =  (before.E_Year == new Date().getFullYear())
  }catch(error){
    errorHandler( res , error)
    return
  }
  if(isOwner && sameYear){
    try {
      await APA_Post.findOneAndUpdate(
        { Post_Id: req.body.IdOfPost },
        { $set: newAppartmentPost }
      )
    }catch(error){
      errorHandler( res , error)
      return
    }
    res.json({
      id : req.body.IdOfPost
    })
  }else{
    let messege = (isOwner ? "" : "not The Post Owner  ")
    messege += (sameYear ? "" : "cant update posts from last year")
    errorHandler( res , null, "server" , messeges)
  }
})


//@desc update building post only if authonticated user id is muching the post id
router.post('/updateBuildingPost', ensureAuth, async (req, res) => {
  let missings =""
  let isOwner = null
  let sameYear = null
  if(!req.body.IdOfPost) missings += "IdOfPost "
  const updatedBuildingPost={
    S_Year: (yearValidate(req.body.startYear)? (req.body.startYear) : (missings += "startYear ", null)),
    E_Year: (yearValidate(req.body.endYear) ? (req.body.endYear) : (missings += "endYear ", null)),
    BU_Students: (req.body.levelOfStudents ? (req.body.levelOfStudents) : (missings += "levelOfStudents ", null)),
    BU_Text: (req.body.buildingText ? (req.body.buildingText) : (missings += "buildingText ", null)),
    BU_rank: (req.body.buildingRank ? (req.body.buildingRank) : (missings += "buildingRank ", null)),
  }
  if(missings!=""){errorHandler( res , null , "server" , "missing fields: "+missings); return;}
  try {
    let before = await BU_Post.findOne({Post_Id : req.body.IdOfPost})
    isOwner = (before.userId == req.user.userId)
    sameYear =  (before.E_Year == new Date().getFullYear())
  } catch (error) {
    errorHandler( res , error)
    return
  }
  if (isOwner && sameYear) {
    try {
      await BU_Post.findOneAndUpdate({Post_Id: req.body.IdOfPost},
        {$set: updatedBuildingPost})
    } catch (error) {
      errorHandler( res , error)
      return
    }
    res.json({
      id : req.body.IdOfPost
    })
  } else {
    let messege = (isOwner ? "" : "not The Post Owner  ")
    messege += (sameYear ? "" : "cant update posts from last year")
    errorHandler( res , null, "server" , messeges)  }
})


//////////////////          DELETE            ///////////////////////////

//@desc delet post by post id only if userId is muching
router.post('/deleteApartmentPost', ensureAuth, async (req, res) => {
  try {
    if (!req.body.IdOfPost) {
      errorHandler(res, "missing fields: IdOfPost")
      return
    }
    let isAuthorized = await APA_Post.findOne({
      Post_Id: req.body.IdOfPost
    }).userId == req.user.userId
    if (isAuthorized) {
      await APA_Post.findOneAndDelete({
        Post_Id: req.body.IdOfPost
      })
      res.json({
        id: req.body.IdOfPost
      })
    } else {
      throw "not The Post Owner"
    }
  } catch (error) {
    errorHandler(res, error)
  }
})


//@desc delet post by post id only if userId is muching
router.post('/deleteBuildingPost', ensureAuth, async (req, res) => {
  let isAuthorized = null
  if(!req.body.IdOfPost){ 
    errorHandler( res , null , "server" ,"missing fields: IdOfPost")
    return
  }
  try { isAuthorized = await BU_Post.findOne({Post_Id: req.body.IdOfPost}).userId == req.user.userId} catch (error) {errorHandler( res , error)}
  if (isAuthorized) {
    try {
      await BU_Post.findOneAndDelete({
        Post_Id: req.body.IdOfPost
      })
      res.json({
        id: req.body.IdOfPost
      })
    } catch (error) {
      errorHandler( res , error)
      return
    }
  } else {
    errorHandler( res , null, "server", "notThePostOwner")
  }
})




//////////////////          TEST            ///////////////////////////


const errorHandler=(res , error)=>{
  res.json(error)
}

const dataObjectCreator = (req , res , reqInfo , addings) =>{
  let dataObject = null
  try {
    clearSessionChekings(req)
    validateMissingFields(req, reqInfo)
    validateFieldsFormat(req, reqInfo)
    dataObject = createObjectForDB(req, reqInfo)
    Object.assign(dataObject, addings)
  } catch (error) {
    errorHandler(res, error)
  }
  return dataObject
}

const clearSessionChekings = (req) =>{
  req.session.missings = null
  req.session.formatIssuse = null
  req.session.validations = null
}

const validateMissingFields = (req , reqInfo) =>{
  for (const [key, value] of Object.entries(reqInfo)) {
    if(req.body[value[0]] == null){
      if(req.session.missings){req.session.missings+=` ${key} ,`; continue}
      req.session.missings=`missing fields: ${value[0]} , `
    }
  }
  if(req.session.missings){throw req.session.missings}
}

const validateFieldsFormat = (req , reqInfo) =>{
  for (const [key, value] of Object.entries(reqInfo)) {
    try {
      if(value[1]){
        value[1](req.body[value[0]])
      }
    } catch (error) {
      if(req.session.formatIssuse){req.session.formatIssuse+=` ${key} ,`; continue}
      req.session.formatIssuse=`format Issus:  ${key} ,`
    } 
  }
  if(req.session.formatIssuse){throw req.session.formatIssuse}
}

const createObjectForDB = ( req , reqInfo ) => {
  const newObject = {}
  for (let [key, value] of Object.entries(reqInfo)) {
    if(value[2])
    newObject[key]=value[2](req.body[value[0]])
  }
  // Object.entries(obj).forEach(entry => {
  //   const [key, value] = entry;
  //   console.log(key, value);
  // });
  return newObject
}

const yearValidate = (num) => {
  const year = new Date().getFullYear()
  let result = toIntOrNull(num) ? (num+5> year && num<year+1) ? num : null : null
  if(!result){throw "year value not valid"}
  return result
}

const OneToFiveValidate = (num) => {
  let result = toIntOrNull(num)? (num>0 && num<6) ? num : null : null
  if(!result){throw "not a 1 to 5 value"}
  return result
}

const toIntOrNull = (num) => {
  num = Number(num)
  return !isNaN(num) ? num : null
}

const justReturnBack = (value) => {
  return value
}

const extreamsToRange = (small , big) => {
  small = toIntOrNull(small)
  big = toIntOrNull(big)
  if(small && big){
    if(small==big){
      return[big]
    }else{
      let range =[]
      while(small<big){
        small++
        range.push(small)
      }
      return range
    }
  }
  return[]
}

const isSameYears = (range, small , big) => {
  let newRange = extreamsToRange(small , big)
  range.forEach(exist => {
    newRange.forEach(newAdd => {
      if(exist==newAdd){return true;}
    })
  });
  return false;
}

router.post('/postToDb', ensureAuth, async (req, res) => {
  const reqInfo = {
    S_Year: ["startYear", yearValidate, toIntOrNull],
    E_Year: ["endYear", yearValidate, toIntOrNull],
    BU_Students: ["levelOfStudents", OneToFiveValidate, toIntOrNull],
    BU_Text: ["buildingText", null, justReturnBack],
    BU_rank: ["buildingRank", OneToFiveValidate, toIntOrNull]
  }
  const addings = {}
  try {
    const dataObject = dataObjectCreator (req , res , reqInfo , addings)  
    if(!dataObject){return}
    res.json(dataObject)
  } catch (err) {
    errorHandler(res, err)
  }
})



module.exports = router




