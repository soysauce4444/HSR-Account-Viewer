// required external modules
const express = require("express");
const path = require("path");
const router = require("./modules/router");
const model = require("./modules/api");

// app variables
const app = express();
const port = process.env.PORT || 8000;
// testing UIDs: 800333171, 601320110 (my account!)

// app config
app.set("view engine", "pug");

// set up folder for static files (e.g. CSS, client-side JS, images)
// app.use(express.static(path.join(__dirname, "public")));

// use page routes from router
app.use("/", router);

// server activation
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
})

