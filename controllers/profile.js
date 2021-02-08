const Profile = require("../models/profile");

// @desc setting req.user with help of param userId
exports.setUser = (req, res, next, id) => {
	//Finding the user profile that matches the param and setting it to req.user
	Profile.findOne({user: id})
		.populate("user", ["name", "email"])
		.then((userProfile) => {
			//no user profile found
			if (!userProfile) {
				return res.status(400).json({
					error: true,
					message: "No user profile found",
				});
			}

			//Hide password before seting the req.user
			userProfile.password = undefined;

			req.user = userProfile;
			next();
		})
		.catch((error) => {
			return res.status(400).json({
				error: true,
				message: "Error in finding the user profile",
			});
		});
};

// @type GET
// @route /profile/:userId
// @desc to view the user profile
// @access PUBLIC
exports.getUserProfileInfo = (req, res) => {
	//If req.user_id = undefined
	if (!req.user) {
		return res.status(400).json({
			error: true,
			message: "No user profile found",
		});
	}

	return res.status(200).json({
		user: req.user,
		error: false,
		message: "user profile found",
	});
};

// @type PUT
// @route /profile/update/:userId
// @desc update user profile
// @access PRIVATE
exports.updateUserProfile = (req, res) => {
	Profile.findOneAndUpdate(
		{_id: req.user._id},
		{$set: req.body},
		(error, userProfile) => {
			if (error) {
				return res.status(400).json({
					message: "Error in updating user profile",
					error: true,
				});
			}
			return res.status(200).json({
				message: "Profile Updated Successfull",
				error: false,
			});
		},
	);
};
