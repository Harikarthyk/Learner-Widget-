//Import Dependencies
const app = require("express");

//Controllers
const {setUser} = require("../controllers/profile");
const {setQuestion , addQuestion} = require("../controllers/question");

const router = app.Router();

router.param("userId", setUser);

router.param('questionId',setQuestion)

// @type POST
// @route /add/question/:userId
// @desc add question
// @access PRIVATE
router.post("/add/question/:userId", addQuestion);

// @type GET
// @route question/:questionId
// @desc get question
// @access PUBLIC
router.post("/question/:questionId", addQuestion);

module.exports = router;
