const tokenService = require("../services/token-service");
const APIResponse = require("../helpers/APIResponse");

module.exports = async function (req, res, next) {

	try {
		const { dukaanAccessCookie } = req.cookies;
		if (!dukaanAccessCookie) {
			throw new Error();
		}

		const userData = await tokenService.verifyAccessToken(dukaanAccessCookie);

		if (!userData) {
			throw new Error();
		}

		req.user = userData;
		next();
	} catch (err) {
		console.log(err);
		return APIResponse.errorResponse(res, "invalid token");
	}

};