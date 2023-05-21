function setTokensInCookie(res, token) {
	// put it in cookie
	res.cookie("dukaanAccessCookie", token.accessToken, {
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
		httpOnly: true,
	});

	res.cookie("dukaanRefreshCookie", token.refreshToken, {
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
		httpOnly: true,
	});
}

module.exports = { setTokensInCookie };