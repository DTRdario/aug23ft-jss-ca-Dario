var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var axios = require("axios");
var indexRouter = require("./routes/index");
var memeRouter = require("./routes/meme-details");
var memesOverviewRouter = require("./routes/memes-overview");
var loginRouter = require("./routes/login");
var passport = require("passport");
var session = require("express-session");
var JsonStore = require("express-session-json")(session);
var app = express();

// Read the configuration file
const config = require("./config.json");

// Global cache for memes
global.memeCache = [];

axios
  .get("http://jss.restapi.co.za/memes")
  .then((response) => {
    global.memeCache = response.data.memes || [];

    // Log detailed information for each meme
    console.log("Memes details:");
    global.memeCache.forEach((meme) => {
      console.log(
        `ID: ${meme.id}, Name: ${meme.name}, URL: ${meme.url}, Width: ${meme.width}, Height: ${meme.height}`
      );
    });
  })
  .catch((error) => {
    console.error("Error fetching memes:", error);
  });

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use("/company-logo", express.static("company logo"));

// Session configuration
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new JsonStore(),
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRouter);
app.use(express.static(path.join(__dirname, "node_modules/bootstrap-icons")));

// Make the config accessible in the req object if needed
app.use((req, res, next) => {
  req.config = config;
  next();
});

// Generate a unique session identifier
const serverSessionId = Date.now();
app.locals.serverSessionId = serverSessionId;

app.use("/", indexRouter);
app.use("/meme-details", memeRouter); // Changed to reflect new file structure
app.use("/memes-overview", memesOverviewRouter);

// Search route
app.get("/search", function (req, res, next) {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    res.json({ memes: [] });
  } else {
    const matchingMemes = global.memeCache.filter((meme) =>
      meme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    res.json({ memes: matchingMemes });
  }
});

// Error handlers
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
