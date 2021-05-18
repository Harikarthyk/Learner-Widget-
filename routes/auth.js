//Import Dependencies
const app = require("express");

//Controllers
const {
  createAccount,
  login,
  getOTPforPassword,
  setNewPassword,
} = require("../controllers/auth");

const router = app.Router();

// @type POST
// @route /createAccount
// @desc creating new Account
// @access PUBLIC
router.post("/createAccount", createAccount);

// @type POST
// @route /login
// @desc Login
// @access PUBLIC
router.post("/login", login);

router.post("/forgotpassword", getOTPforPassword);

router.post("/set/password", setNewPassword);

module.exports = router;
