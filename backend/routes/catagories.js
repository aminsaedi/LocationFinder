const express = require("express");

const auth = require("../middlewares/auth");
const catagoriesController = require("../controllers/catagories");

const router = express.Router();

router.get("/", catagoriesController.getAllCatagories);

router.post("/", auth, catagoriesController.postNewCatagory);

module.exports = router;
