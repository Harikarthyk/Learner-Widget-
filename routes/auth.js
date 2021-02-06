const app = require("express");
const { createAccount } = require("../controllers/auth");
const router = app.Router() ;

// @type POST 
// @route /createAccount
// @desc creating new Account 
// @access PUBLIC
router.post('/createAccount',createAccount)

module.exports = router;
