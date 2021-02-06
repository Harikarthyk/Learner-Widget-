const User = require("../models/user");

exports.createAccount = (req, res) => {
	//Find if any other user uses the same mail id
	User.findOne({email: req.body.email}, (err, result) => {
		if (err || result) {
			return res.status(400).json({
				messsage: "Email Id Already registerd",
				error: true,
			});
		}

		//Creating new user and Saving it DB
		let newUser = new User(req.body);
		//Attempt to save
		newUser
			.save()
			.then(() => {
				return res.status(200).json({
					messsage: "New Account created successfully",
					error: false,
				});
			})
			.catch((error) =>
				res.status(400).json({
					messsage: "Error in creating Account",
					error: true,
				}),
			);
	});
};
