const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		heading: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		label: {
			type: Array,
			required: true,
			default: [],
		},
		upvotes: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: "User",
				},
			},
		],
		answers: [
			{
				user: {
					type: mongoose.Schema.ObjectId,
					ref: "User",
				},
				text: {
					type: String,
					required: true,
					trim: true,
				},

				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{timestamps: true},
);

module.exports = Question = mongoose.model("Question", questionSchema);
