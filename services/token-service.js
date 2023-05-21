const jwt = require("jsonwebtoken");
const refreshModal = require("../models/refresh-model");

class TokenService {
	generateToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
			expiresIn: "6h"
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
			expiresIn: "1y"
		});

		return { accessToken, refreshToken };
	}

	async storeRefreshToken(token, userId) {
		try {
			await refreshModal.create({
				token,
				userId
			});
		} catch (err) {
			console.log(err);
		}
	}

	async verifyAccessToken(token) {
		return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
	}

	async verifyRefreshToken(token) {
		return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
	}

	async findRefreshToken(userId, refreshToken) {
		return await refreshModal.findOne({ userId: userId, token: refreshToken });
	}

	async updateRefreshToken(userId, refreshToken) {
		return await refreshModal.updateOne({ userId: userId }, { token: refreshToken });
	}

	async removeToken(refreshToken) {
		return await refreshModal.deleteOne({ token: refreshToken });
	}
}

module.exports = new TokenService();