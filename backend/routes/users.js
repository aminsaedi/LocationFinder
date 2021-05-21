const express = require("express");

const auth = require("../middlewares/auth");
const usersController = require("../controllers/users");

const router = express.Router();

router.post("/login", usersController.postLoginUser);
router.post("/register", usersController.postRegisterUser);

module.exports = router;
