const express = require ("express")
const router = express.Router()

//@desc login/landing
//@route GET /
router.get('/',(req,res)=>{
  res.send("slag = '/'")
})

//@desc login/landing
//@route GET /
router.get('/dashboard',(req,res)=>{
  res.send("slag = '/dashboard'")
})



module.exports = router
