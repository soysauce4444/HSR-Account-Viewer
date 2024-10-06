var express = require("express");
var router = express.Router();

var model = require("./api");

// convert query string formats from form data into JSON format
router.use(express.urlencoded({ extended: true}));
router.use(express.json());

// route definitions
router.get("/", (request, response) => {
  response.render("index", { title: "Home" });
}); // home page before submitting the form
router.get("/dashboard", async (request, response) => {
  response.render("dashboard", { title: "Dashboard" });
});
router.get("/characters", async (request, response) => {
  try{
    const characters = await model.listAllCharacters();
    response.render('characters', { title: "Characters", characters});
  } catch(error){
    console.log("Error:", error)
    response.status(500).send("Error occurred while processing request")
  }
});
router.get("/lightcones", async (request, response) => {
  try{
    const lightcones = await model.listAllLightCones();
    response.render("lightcones", { title: "Light Cones", lightcones });
  } catch(error) {
    console.log("Error:", error)
    response.status(500).send("Error occurred while processing request")
  }
});

// form processing paths
router.post('/', async (request, response) => {
  let uid = request.body.uid;
  try {
    const userDashboard = await model.getUserDashboard(uid);
    response.render("index", { title: "User Dashboard", userDashboard });
  } catch(error) {
    console.log("Error:", error)
    response.status(500).send("an error occurred while processing the request")
  }
});

module.exports = router;