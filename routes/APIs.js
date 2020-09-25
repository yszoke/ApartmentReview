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
      ST_Name: streets[i],
      Buildings: {}
    }
    const exsist = await Street.findOne({ ST_Name: newO.ST_Name})
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


const dbNames = {
  BU_Id: "buildingId",
  APA_Id: "apartmentId",
  S_Year: "startYear",
  E_Year: "endYear",
  BU_Students: "levelOfStudents",
  BU_Text: "buildingText",
  BU_Rank: "buildingRank",
  APA_Text: "apartamentText",
  APA_rank: "rank",
  Cost: "rentCost",
  Bills: "heshbonot",
  ST_Name: "streetName",
  BU_Name: "buildingName",
  ST_Id: "streetId",
  APA_Name: "apartmentName",
  Post_Id : "IdOfPost"
  
}

//////////////////          CREATE            ///////////////////////////

//@desc create new street  //isChanged V //missingChackedReturn V //tryCatchreturn v
router.post('/createStreet', ensureAuth, ensureAdmin, async (req, res) => {
  const reqInfo = {
    ST_Name: [dbNames.ST_Name, null, justReturnBack],
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
    BU_Name: [dbNames.BU_Name, null, justReturnBack],
    ST_Id: [dbNames.ST_Id, null, justReturnBack],
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
  }
})

//@desc create new apartment //isChanged V  //missingChackedReturn V  //tryCatchreturn V
router.post('/createApartment', ensureAuth, async (req, res) => {
  const reqInfo = {
    BU_Id: [dbNames.BU_Id, null, justReturnBack],
    ST_Id: [dbNames.ST_Id, null, justReturnBack],
    APA_Name: [dbNames.APA_Name, null, justReturnBack],
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

  const reqInfo = {...apartmentPostReqData}
  const addings = {
      Post_Id: uuidv4(),
      User_Id: req.user.User_Id,
      CreatorsGoogleID : req.user.googleId,//for security ONLY
  }
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    const userData= await User.findOne({User_Id:req.user.User_Id},{activeYears:1})
    const postRange = extreamsToRange (req.body[dbNames.S_Year], req.body[dbNames.E_Year])
    findIdenticalYears(userData , postRange )
    await APA_Post.create(dataObject) 
    await User.findOneAndUpdate ({User_Id:req.user.User_Id},{
      $push: {activeYears: createUserPairs(dataObject.Post_Id , postRange)}
    })
    res.json({id: dataObject.Post_Id})
  } catch (err) {
    errorHandler(res, err)
  }
})

//@desc create new building post //isChanged V  //missingChackedReturn V //tryCatchreturn 
router.post('/createBuildingPost', ensureAuth, async (req, res) => {
  let reqInfo = {...BuildingPostReqData}
  const addings = {
    Post_Id: uuidv4(),
    User_Id: req.user.User_Id,
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
    let DB_Streets = await Street.find({},{_id:0, DB_Buildings:0})//ST_Id: 1  ST_Name: 1
    console.log("getAllStreets")
    await DB_Streets.forEach((element)=>{
      API_Streets.push({
        Id: element.ST_Id,
        streetName: element.ST_Name
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
    if(!req.body[dbNames.ST_Id]){ throw `missing fields: ${dbNames.ST_Id}` }
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
    if(!req.body[dbNames.BU_Id]){ throw `missing fields: ${dbNames.BU_Id}`}
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
    if(!req.body[dbNames.APA_Id]){ throw `missing fields: ${dbNames.APA_Id}` }
    let DB_ApartmentPosts = await APA_Post.find({APA_Id: req.body[dbNames.APA_Id]},
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
    const DBInfo = {...apartmentPostReqData}
    DBInfo.Post_Id=["PostId"]
    res.json(hideDB_Names(DB_ApartmentPosts , DBInfo)) 
  } catch (error) {
    errorHandler( res , error)
  }
})

//@desc post all building post for a building
router.post('/getBuildingPosts', ensureAuth, async(req, res) => {
  try{ 
    if(!req.body[dbNames.BU_Id]){ throw `missing fields: ${dbNames.BU_Id}`}
    let DB_BuildingPosts = await BU_Post.find({BU_Id: req.body[dbNames.BU_Id]},{
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
    // BU_Rank: 1 
  })
    const DBInfo = {...BuildingPostReqData}
    DBInfo.Post_Id=["PostId"]
    res.json(hideDB_Names(DB_BuildingPosts , DBInfo))
  }catch(error){
    errorHandler( res , error)
  }
})

//@desc post all apartment posts that belongs to a user
router.post('/getMyApartmentPosts', ensureAuth, async (req, res) => {
  try {
    let DB_ApartmentPosts = await APA_Post.find({User_Id: req.user.User_Id},
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
  }) 
  const DBInfo = {...apartmentPostReqData}
  DBInfo.Post_Id=["PostId"]
  res.json(hideDB_Names (DB_ApartmentPosts , DBInfo))
  }catch(error){
    errorHandler( res , error)
  }
})

//@desc post all building post that belongs to a user
router.post('/getMyBuildingPosts', ensureAuth, async(req, res) => {
  try{ 
    let DB_BuildingPosts = await BU_Post.find({User_Id: req.user.User_Id},{
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
    // BU_Rank: 1 
  })
  const DBInfo = {... BuildingPostReqData}
  DBInfo.Post_Id=["PostId"]
  res.json(hideDB_Names(DB_BuildingPosts , DBInfo))
}catch(error){
    errorHandler( res , error)
  }
  
})


//////////////////          UPDATE            ///////////////////////////

//@desc update apartment post only if authonticated user id is muching the post id
router.post('/updateApartmentPost' , ensureAuth , async (req , res) => {
  let reqInfo = {...apartmentPostReqData}
  reqInfo.Post_Id = [dbNames.Post_Id,null , null]
  delete reqInfo.S_Year 
  delete reqInfo.E_Year 
  delete reqInfo.APA_Id 
  const addings = {}
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    authorizeReq(req, APA_Post, true)
    await APA_Post.findOneAndUpdate({Post_Id: req.body.IdOfPost}, {
      $set: dataObject
    })
    res.json({id: req.body.IdOfPost})
  } catch (err) {
    errorHandler(res, err)
  }
})

//@desc update building post only if authonticated user id is muching the post id
router.post('/updateBuildingPost', ensureAuth, async (req, res) => {
  let reqInfo = {...BuildingPostReqData}
  reqInfo.Post_Id = [dbNames.Post_Id, null, null]
  delete reqInfo.S_Year
  delete reqInfo.BU_Id
  delete reqInfo.APA_Id
  const addings = {}
  try {
    const dataObject = dataObjectCreator(req, res, reqInfo, addings)
    if (!dataObject) {return}
    await authorizeReq(req, BU_Post, true)
    await BU_Post.findOneAndUpdate({Post_Id: req.body.IdOfPost},{
      $set: dataObject
    })
    res.json({
      id: req.body.IdOfPost
    })
  } catch (err) {
    errorHandler(res, err)
  }
})


//////////////////          DELETE            ///////////////////////////

//@desc delet post by post id only if User_Id is muching
router.post('/deleteApartmentPost', ensureAuth, async (req, res) => {
  try {
    if(!req.body[dbNames.Post_Id]){ throw `missing fields: ${dbNames.Post_Id}`}
    await authorizeReq (req , APA_Post , false)
    await APA_Post.findOneAndDelete({Post_Id: req.body.IdOfPost})
    await User.update({User_Id:req.user.User_Id}, { $pull: { activeYears: { PostId: req.body.IdOfPost} } },
    { multi: true })
    res.json({id: req.body.IdOfPost})
  } catch (error) {
    errorHandler(res, error)
  }
})

//@desc delet post by post id only if User_Id is muching
router.post('/deleteBuildingPost', ensureAuth, async (req, res) => {
  try { 
    if(!req.body[dbNames.Post_Id]){ throw `missing fields: ${dbNames.Post_Id}`}
    await authorizeReq (req , BU_Post , false)
    await BU_Post.findOneAndDelete({Post_Id: req.body.IdOfPost})
    res.json({ id: req.body.IdOfPost })
  }catch (error) {
    errorHandler( res , error)
  }
})


//////////////////          TEST            ///////////////////////////

const errorHandler=(res , error)=>{
  if (error.code && error.code==11000){
    delete error["keyValue"]
    error["serverMessege"] = "not_Unique"
    error["uniqueIndex"] = hideDB_Names(error["keyPattern"],dbNames)
    delete error["keyPattern"] 
  }
  res.json({error : error})
}

const authorizeReq = async (req, postModule, checkYearAlso) => {
  const postData= await postModule.findOne({Post_Id:req.body.IdOfPost})
  const postOwner = postData.User_Id
  const senderId= req.user.User_Id
  const isOwner = postOwner == senderId
  let error = ""
  if(!isOwner){error +=  "not the post owner"}
  if(checkYearAlso){
    const oldPost = postData.E_Year<new Date().getFullYear()
    if (oldPost){ error+= "cant update posts from last year"
    }
  }
  if(error != ""){throw error}
  return true
}

const hideDB_Names = (data, info) => {
  let resDataObject = {}
  for (const [key, value] of Object.entries(data)) {
    if (info[key]) {
      if(typeof(info[key])=="string"){
        resDataObject[info[key]] = value
      }else{
        resDataObject[info[key]][0] = value
      }
    }
  }
  return resDataObject
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

const findIdenticalYears = (userData, postRange) =>{
  console.log(userData.activeYears)
  let identicalYears = []
  postRange.forEach((postYear) => {
    userData.activeYears.forEach((userPair) =>{
      if(postYear==userPair.Year){
        identicalYears.push(userPair) 
      }
    })
  })
  if(identicalYears.length>0){
    throw identicalYears
  }
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

const createUserPairs = (PostId , postRange) =>{
  const userPairs=[]
  postRange.forEach((year)=>{
    userPairs.push({Year: year, PostId: PostId })
  })
  return userPairs
}

const clearSessionChekings = (req) =>{
  req.session.missings = null
  req.session.formatIssuse = null
  req.session.validations = null
}

const validateMissingFields = (req , reqInfo) =>{
  for (const [key, value] of Object.entries(reqInfo)) {
    if(req.body[value[0]] == null){
      if(req.session.missings){req.session.missings+=` ${value[0]} ,`; continue}
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
      if(req.session.formatIssuse){req.session.formatIssuse+=` ${value[0]} : ${error} ,`; continue}
      req.session.formatIssuse=`format Issus:  ${value[0]} : ${error} ,`
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
  num = toIntOrNull (num)
  num = num ? (num+5> year && num<year+2) ? num : null : null
  if(!num){throw "year value not valid"}
  return num
}

const OneToFiveValidate = (num) => {
  num = toIntOrNull (num)
  num = num ? (num>0 && num<6) ? num : null : null
  if(!num){throw "not a 1 to 5 value"}
  return num
}

const isResenableCost = (num) => {
  num = toIntOrNull (num)
  num = num ? (num>-1 && num<10000) ? num : null : null
  if(!num){throw "not a 1 to 5 value"}
  return num
}

const isString = (string) => {
  if(typeof(string) != "string"){throw "not a string value"}
  return string
}

const toIntOrNull = (num) => {
  num = Number(num)
  return !isNaN(num) ? num : null
}

const justReturnBack = (value) => {
  return value
}


const apartmentPostReqData = {
  APA_Id: [dbNames.APA_Id, null, justReturnBack],
  S_Year: [dbNames.S_Year, yearValidate, toIntOrNull],
  E_Year: [dbNames.E_Year, yearValidate, toIntOrNull],
  APA_Text: [dbNames.APA_Text, isString, justReturnBack],
  APA_rank: [dbNames.APA_rank, OneToFiveValidate, toIntOrNull],
  Cost: [dbNames.Cost, isResenableCost, toIntOrNull],
  Bills: [dbNames.Bills, isResenableCost, toIntOrNull],
}

const BuildingPostReqData = {
  BU_Id: [dbNames.BU_Id, null, justReturnBack],
  APA_Id: [dbNames.APA_Id, null, justReturnBack],
  S_Year: [dbNames.S_Year, yearValidate, toIntOrNull],
  E_Year: [dbNames.E_Year, yearValidate, toIntOrNull],
  BU_Students: [dbNames.BU_Students, OneToFiveValidate, toIntOrNull],
  BU_Text: [dbNames.BU_Text, isString, justReturnBack],
  BU_Rank: [dbNames.BU_Rank, OneToFiveValidate, toIntOrNull],
}



router.post('/postTest', ensureAuth, async (req, res) => {
  const reqInfo = {
    S_Year: [dbNames.S_Year, yearValidate, toIntOrNull],
    E_Year: [dbNames.E_Year, yearValidate, toIntOrNull],
    BU_Students: [dbNames.BU_Students, OneToFiveValidate, toIntOrNull],
    BU_Text: [dbNames.BU_Text, null, justReturnBack],
    BU_Rank: [dbNames.BU_Rank, OneToFiveValidate, toIntOrNull]
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
