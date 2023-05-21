const crypto = require("crypto");

class HashService {
	hashOtp(data) {
		return crypto.createHmac("sha256", process.env.HASH_SECRET).update(data).digest("hex");
	}

	hashPassword(password) {
		return crypto.createHmac("sha256", process.env.HASH_SECRET).update(password).digest("hex");
	}

	async compare(data, hashedPassword) {
		let computedPassword = crypto.createHmac("sha256", process.env.HASH_SECRET).update(data).digest("hex");
		return computedPassword === hashedPassword;
	}
}

module.exports = new HashService();