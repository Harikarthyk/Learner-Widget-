const Question = require("../models/question");

// @desc setting req.question with help of param questionId
exports.setQuestion = (req, res, next, id) => {
	Question.findOne({_id: id})
		.populate("user", ["name", "email"])
		.then((entireQuestion) => {
			if (!entireQuestion) {
				res.status(400).json({
					error: true,
					message: "No Question found",
				});
			}
			req.question = entireQuestion;
			next();
		})
		.catch((error) =>
			res.status(400).json({
				error: true,
				message: "Error in getting the question",
			}),
		);
};

// @type GET
// @route question/:questionId
// @desc get question
// @access PUBLIC
exports.getQuestion = (req, res) => {
	if (!req.question) {
		return res.status(200).json({
			error: false,
			message: "No Question found",
		});
	}
	return res.status(200).json({
		error: false,
		message: "Question fetched Successfully",
		question: req.question,
	});
};

// @type POST
// @route /add/question/:userId
// @desc add question
// @access PRIVATE
exports.addQuestion = (req, res) => {
	if (!req.user) {
		return res.status(400).json({
			message: "Unauthorized user to add question",
			error: true,
		});
	}
	let newQuestion = new Question(req.body);
	newQuestion
		.save()
		.then(() => {
			return res.status(200).json({
				error: false,
				message: "Question Added successfully",
			});
		})
		.catch((error) =>
			res.status(400).json({
				error: true,
				message: "Error in adding the question",
			}),
		);
};
