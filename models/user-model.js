const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	isAdmin: { type: Boolean, default: false },
	email: { type: String },
	name: { type: String },
	password: { type: String },
	storeLink: { type: String },
	address: [
		{
			street: { type: String },
			landmark: { type: String },
			city: { type: String },
			pincode: { type: String },
		}
	],
	orders: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId, ref: "Order"
			}
		]
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("User", userSchema, "users");