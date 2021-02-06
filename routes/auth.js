const app = require("express");
const router = app.Router() ;


router.post('/createAccount',createAccount)

module.exports = router;
