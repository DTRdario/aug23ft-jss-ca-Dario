var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Your Page Title",
    user: req.user, // Pass the user object to the view
  });
});

module.exports = router;
