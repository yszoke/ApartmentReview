const express = require("express")
const router = express.Router()
const {
  ensureAuth,
} = require('../middleware/auth')

//@desc landing
//@route GET /
router.get('/', (req, res) => {
  res.send("slag = '/'")
})


//@desc authEndPoint
//@route GET /
router.get('/logged', ensureAuth, (req, res) => {
  res.send("slag = '/'")
})


ensureAuth



module.exports = router
