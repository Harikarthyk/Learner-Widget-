const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		profession: {
			type: String,
		},
		description: {
			type: String,
			trim: true,
		},
		skills: {
			type: Array,
			default: [],
		},
		profile_picture: {
			type: String,
			default: "https://img.icons8.com/bubbles/2x/user.png",
		},
		phone_number: {
			type: String,
			trim: true,
		},
		portfolio: {
			type: String,
			trim: true,
		},
	},
	{timestamps: true},
);

module.exports = Profile = mongoose.model("Profile", profileSchema);
