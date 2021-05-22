const express = require("express");

const auth = require("../middlewares/auth");
const locationController = require("../controllers/locations");

const router = express.Router();

router.delete("/:id", auth, locationController.deleteDeleteLocation);

router.get("/city/:city", locationController.getAllLocationsInCity);
router.get("/id/:id", locationController.getLocationById);
router.get("/madeByMe", auth, locationController.getUserCreatedLocations);
router.get("/direction/:id", locationController.getDirection);

router.post("/add", auth, locationController.postNewLocation);
router.post("/comment/:id", auth, locationController.postAddComment);

router.put("/like/:id", auth, locationController.putLikeLocation);

module.exports = router;
