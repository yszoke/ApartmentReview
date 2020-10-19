const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

// const cors = require("cors");
// const corsConfig = {
//   origin: true,
//   credentials: true,
// };
// router.use(cors(corsConfig));

//@desc landing
//@route GET /
router.get("/", (req, res) => {
  res.send("slag = '/'");
});

//@desc authEndPoint
//@route GET /
router.get("/logged", ensureAuth, (req, res) => {
  res.send("slag = '/'");
});

ensureAuth;

module.exports = router;
