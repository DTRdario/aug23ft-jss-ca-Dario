var express = require("express");
var router = express.Router();

// Authentication middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

// Route for fetching a specific meme by its ID, protected by authentication middleware
router.get("/:id", ensureAuthenticated, function (req, res, next) {
  const requestedId = parseInt(req.params.id, 10);
  const meme = global.memeCache.find((m) => m.id === requestedId);

  if (meme) {
    res.render("meme-details", {
      // Updated view name
      meme: meme,
      user: req.user,
    });
  } else {
    res.status(404).send("Meme not found");
  }
});

// POST route for viewing meme details
router.post("/details", function (req, res, next) {
  const memeId = req.body.id;
  const meme = global.memeCache.find((m) => m.id === parseInt(memeId, 10));

  if (meme) {
    res.render("meme-details", {
      // Updated view name
      meme: meme,
      user: req.user,
    });
  } else {
    res.status(404).send("Meme not found");
  }
});

module.exports = router;
