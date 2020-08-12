const express = require ("express")
const router = express.Router()

//@desc login/landing
//@route GET /
router.get('/',(req,res)=>{
  res.send("hallow")
})

module.exports = router
