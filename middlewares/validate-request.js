
const { validationResult } = require("express-validator");
const APIResponse = require("../helpers/APIResponse");

function validate(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const firstError = errors.array({ onlyFirstError: true })[0];
		console.log(firstError);
		return APIResponse.validationErrorWithData(
			res,
			firstError,
			firstError?.msg
		);
	}
	next();
}

module.exports = validate;