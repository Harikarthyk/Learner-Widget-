//Import dependencies
const express = require("express");

//Controllers
const {
	setUser,
	getUserProfileInfo,
	updateUserProfile,
} = require("../controllers/profile");

const router = express.Router();

router.param("userId", setUser);

// @type GET
// @route /profile/:userId
// @desc to view the user profile
// @access PUBLIC
router.get("/profile/:userId", getUserProfileInfo);

// @type PUT
// @route /profile/update/:userId
// @desc update user profile
// @access PRIVATE
router.put("/profile/update/:userId", updateUserProfile);

module.exports = router;
