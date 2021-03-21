//Import Dependencies
const bcrypt = require("bcrypt");
const Profile = require("../models/profile");

//Models
const User = require("../models/user");

//TODO => MAKE IT PRIVATE
let saltRounds = 10;

// @type POST
// @route /createAccount
// @desc creating new Account
// @access PUBLIC
exports.createAccount = (req, res) => {
	//Find if any other user uses the same mail id
	User.findOne({email: req.body.email}, (err, prevUser) => {
		if (err || prevUser) {
			return res.status(400).json({
				messsage: "Email Id Already registerd",
				error: true,
			});
		}

		//Hashing password
		bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
			// Store hash in your password req.body.password
			req.body.password = hash;

			//Creating new user and Saving it DB
			let newUser = new User(req.body);
			//Attempt to save
			newUser
				.save()
				.then((newUser) => {
					let userProfile = new Profile({
						user: newUser._id,
						profession: "",
						description: "",
						skills: [],
						phone_number: "",
						portfolio: "",
					});
					newUser.password = undefined;
					userProfile
						.save()
						.then(() =>
							res.status(200).json({
								messsage: "New Account created successfully",
								error: false,
								user: newUser,
							}),
						)
						.catch((error) =>
							res.status(400).json({
								messsage: "Error in creating Account",
								error: true,
							}),
						);
				})
				.catch((error) =>
					res.status(400).json({
						messsage: "Error in creating Account",
						error: true,
					}),
				);
		});
	});
};

// @type POST
// @route /login
// @desc Login
// @access PUBLIC
exports.login = (req, res) => {
	User.findOne({email: req.body.email}, (err, prevUser) => {
		if (err) {
			return res.status(400).json({
				messsage: "Error in Loging in",
				error: true,
			});
		}

		//If no email Id regiterd with the req.body.email
		if (!prevUser) {
			return res.status(200).json({
				messsage: "No Account is created with this Email Id",
				error: true,
			});
		}

		//Comparing req.body.password with hased password in DB
		bcrypt.compare(req.body.password, prevUser.password, (err, result) => {
			//If result = false wrong password
			if (err || !result) {
				return res.status(400).json({
					messsage: "Missmatch Password or Email Id",
					error: true,
				});
			}

			//Hide password before sending the response
			prevUser.password = undefined;

			//Password match Login Successfull
			return res.status(200).json({
				messsage: "Login Successfull",
				error: false,
				user: prevUser,
			});
		});
	});
};
