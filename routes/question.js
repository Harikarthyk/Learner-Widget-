//Import Dependencies
const app = require("express");

//Controllers
const {setUser} = require("../controllers/profile");
const {
	setQuestion,
	addQuestion,
	getAllQuestion,
	deleteQuestion,
	addAnswer,
	deleteAnswer,
	upvoteQuestion,
} = require("../controllers/question");

const router = app.Router();

router.param("userId", setUser);

router.param("questionId", setQuestion);

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

// @type GET
// @route /all/questions
// @desc get all question
// @access PUBLIC
router.get("/all/questions", getAllQuestion);

// @type DELETE
// @route question/:userId/:questionId
// @desc delete question
// @access PRIVATE
router.delete("/question/:userId/:questionId", deleteQuestion);

// @type PUT
// @route add/answer/question/:userId/:questionId
// @desc add answer for the question
// @access PRIVATE
router.put("/add/answer/question/:userId/:questionId", addAnswer);

// @type DELETE
// @route delete/answer/question/:userId/:questionId
// @desc delete answer for the question
// @access PRIVATE
router.delete("/delete/answer/question/:userId/:questionId", deleteAnswer);

// @type PUT
// @route upvote/question/:userId/:questionId
// @desc upvote for the question
// @access PRIVATE
router.put("/upvote/question/:userId/:questionId", upvoteQuestion);

module.exports = router;
