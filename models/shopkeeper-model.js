const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema({
	name: { type: String },
	businessName: { type: String },
	logo: { type: String },
	email: { type: String, unique: true },
	password: { type: String },
	googleId: { type: String },
	storeLink: { type: String },
	isSeller: { type: Boolean, default: true },
	template: { type: Number, default: 1 },
	category: [
		{
			type: String
		}
	],
	banner: { type: String },
	description: { type: String },
	supportEmail: { type: String },
	supportPhone: { type: String },
	deliveryCharges: { type: Number, default: 40 },
	deliveryTiming: { type: String },
}, { timestamps: true }
);

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);