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
// @route  
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
// @type GET
// @route /all/question
// @desc get all question
// @access PUBLIC
exports.getAllQuestion = (req, res) => {
	Question.find({})
		.populate("user", "_id name email")
		.populate("answers.user", "_id name email")
		.sort({createdAt: "desc"})
		.then((questions) =>
			res.status(200).json({
				error: false,
				message: "Questions fetched successfully",
				questions: questions,
			}),
		)
		.catch((error) =>
			res.status(400).json({
				error: true,
				message: "Error in fetching all questions",
			}),
		);
};

// @type DELETE
// @route question/:userId/:questionId
// @desc delete question
// @access PRIVATE
exports.deleteQuestion = (req, res) => {
	//If req.question not available
	if (!req.question) {
		return res.status(400).json({
			error: true,
			message: "Question not found , error in deleting the question",
		});
	}

	//Question can be deleted by user who posted it
	if (req.user._id != req.question.user._id) {
		return res.status(400).json({
			error: true,
			message: "Unauthorized command performed",
		});
	}

	//Attempt to delete the question
	Question.findOneAndDelete(
		{_id: req.question._id},
		(error, deletedQuestion) => {
			if (error) {
				return res.status(400).json({
					error: true,
					message: "Error in deleting the question",
				});
			}
			if (!deletedQuestion) {
				return res.status(400).json({
					error: true,
					message: "No question found to delete",
				});
			}
			return res.status(200).json({
				error: false,
				message: "Question deleted Successfully",
			});
		},
	);
};

// @type PUT
// @route add/answer/question/:userId/:questionId
// @desc add answer for the question
// @access PRIVATE
exports.addAnswer = (req, res) => {
	//If req.question not available
	if (!req.question) {
		return res.status(400).json({
			error: true,
			message: "No question found",
		});
	}

	//If req.user not available
	if (!req.user) {
		return res.status(400).json({
			error: true,
			message: "No user found",
		});
	}

	let newAnswer = req.body;
	req.question.answers.unshift(newAnswer);
	req.question
		.save()
		.then(() => {
			return res.status(200).json({
				error: false,
				message: "Answer posted successfully",
			});
		})
		.catch((error) =>
			res.status(400).json({
				error: true,
				message: "Error in posting the answer",
			}),
		);
};

// @type DELETE
// @route delete/answer/question/:userId/:questionId
// @desc delete answer for the question
// @access PRIVATE
exports.deleteAnswer = (req, res) => {
	//If req.question not available
	if (!req.question) {
		return res.status(400).json({
			error: true,
			message: "No question found",
		});
	}

	//If req.user not available
	if (!req.user) {
		return res.status(400).json({
			error: true,
			message: "No user found",
		});
	}

	//Finding the question the answer belongs
	Question.findOne({_id: req.question._id}, (error, entireQuestion) => {
		if (error) {
			return res.status(400).json({
				error: "Error in deleting the answer",
			});
		}
		let answers = entireQuestion.answers;
		entireQuestion.answers = answers.filter(
			(answer) => String(answer._id) !== req.body.answerId,
		);

		//Attempt to delete the answer
		entireQuestion
			.save()
			.then(() => {
				return res.status(200).json({
					error: false,
					message: "Answer deleted successfully",
				});
			})
			.catch((error) =>
				res.status(400).json({
					error: true,
					message: "Error in deleting the successfully",
				}),
			);
	});
};

exports.getQuestionByUserId = (req, res) => {
	Question.find({user: req.user.user._id})
		.populate("user", "_id name email")
		.sort({createdAt: "desc"})
		.then((questions) =>
			res.status(200).json({
				error: false,
				message: "Questions fetched successfully",
				questions: questions,
			}),
		)
		.catch((error) =>
			res.status(400).json({
				error: true,
				message: "Error in fetching all questions",
			}),
		);
};

exports.upvoteQuestion = (req, res) => {};
