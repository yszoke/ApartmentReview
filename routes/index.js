const express = require("express")
const router = express.Router()
const {
  ensureAuth,
  ensureGest
} = require('../middleware/auth')

//@desc login/landing
//@route GET /
router.get('/', (req, res) => {
  res.send("slag = '/'")
})

//@desc login/landing
//@route GET /
router.get('/isAuthUsers', (req, res) => {
  res.json({
    isAuth: true
  })
})

//@desc login/landing
//@route GET /
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

//@desc login/landing
//@route GET /
router.post('/postReview', ensureAuth, (req, res) => {
  const apartamentID = req.body.apartamentID
  const postID = req.body.postID
  const startYear = req.body.startYear
  const endYear = req.body.endYear
  const apartamentText = req.body.apartamentText
  const rank = req.body.rank
  const rentCost = req.body.rentCost
  const heshbonot = req.body.heshbonot
  const buildingComments = req.body.buildingComments
  const buildingId = req.body.buildingId
  const levelOfStudents = req.body.levelOfStudents
  const buildingText = req.body.buildingText
  const buildingRank = req.body.buildingRank
})

//@desc deletPost
//@route delet /
router.get('/test', ensureAuth, (req, res) => {
  res.json({})
})

//@desc editPost
//@route GET /
router.get('/test', ensureAuth, (req, res) => {
  res.json({})
})

//@desc seeYourPosts
//@route GET /
router.get('/test', ensureAuth, (req, res) => {
  res.json({})
})

module.exports = router
