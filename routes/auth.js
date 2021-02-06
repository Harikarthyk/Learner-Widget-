//Import Dependencies
const app = require("express");
const router = app.Router();

//Controllers
const {createAccount, login} = require("../controllers/auth");

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

module.exports = router;
