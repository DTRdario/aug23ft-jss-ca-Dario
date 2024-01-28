var express = require("express");
var router = express.Router();

// Route for Memes Overview
router.get("/", function (req, res, next) {
  // Pass both the memes and the user object to the template
  res.render("memes-overview", {
    memes: global.memeCache,
    user: req.user, // Add this line to pass the user object
  });
});

module.exports = router;
