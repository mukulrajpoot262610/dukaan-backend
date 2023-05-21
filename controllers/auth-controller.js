const hashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");
const passport = require("passport");
const APIResponse = require("../helpers/APIResponse");
const { setTokensInCookie } = require("../helpers/index");


class AuthController {
	async sendOtp(req, res) {
		const { email, password } = req.body;

		try {
			let user = await userService.findUser({ email });

			if (user) {
				return APIResponse.validationError(res, "user already exists");
			}

			const otp = await otpService.generateOtp();

			//hash
			const ttl = 1000 * 60 * 2;  // 2 Minute expiry time
			const expires = Date.now() + ttl;
			const data = `${email}.${otp}.${expires}`;
			const hash = hashService.hashOtp(data);

			//sendOtp
			// await otpService.sendBySms(phone, otp);
			APIResponse.successResponseWithData(res, {
				hash: `${hash}.${expires}`,
				email,
				password,
				otp
			}, "OTP sent successfully");
		} catch (err) {
			console.log(err);
			return APIResponse.errorResponse(res);
		}
	}

	async verifyOtp(req, res) {
		const { otp, hash, email, password } = req.body;

		try {
			const [hashedOtp, expires] = hash.split(".");

			if (Date.now() > +expires) {
				return APIResponse.validationError(res, "OTP Expired");
			}

			const data = `${email}.${otp}.${expires}`;
			const isValid = await otpService.verifyOtp(hashedOtp, data);

			if (!isValid) {
				return APIResponse.validationError(res, "Invalid OTP");
			}

			let user;

			user = await userService.findUser({ email });
			if (!user) {
				user = await userService.createUser({ email, password });
			}

			// generate new token
			const { accessToken, refreshToken } = tokenService.generateToken({
				_id: user._id,
				role: user.role,
				activated: user.activated
			});

			// save refresh token in db
			const savedToken = tokenService.storeRefreshToken(
				user._id,
				refreshToken
			);

			if (!savedToken) {
				return APIResponse.errorResponse(res);
			}

			setTokensInCookie(res, { accessToken, refreshToken });
			user.password = null;
			return APIResponse.successResponseWithData(res, user, "logged in");
		} catch (err) {
			console.log(err);
			return APIResponse.errorResponse(res);
		}
	}

	async login(req, res) {
		const { email, password } = req.body;

		try {
			const user = await userService.findUser({ email });

			if (!user) {
				return APIResponse.validationError(res, "user not found");
			}

			const match = await hashService.compare(password, user.password);
			if (!match) {
				return APIResponse.validationError(res, "wrong credentials");
			}

			// generate new token
			const { accessToken, refreshToken } = tokenService.generateToken({
				_id: user._id,
				role: user.role,
				activated: user.activated
			});

			// save refresh token in db
			const savedToken = tokenService.storeRefreshToken(
				user._id,
				refreshToken
			);

			if (!savedToken) {
				return APIResponse.errorResponse(res);
			}

			setTokensInCookie(res, { accessToken, refreshToken });
			user.password = null;
			return APIResponse.successResponseWithData(res, user, "logged in");
		} catch (err) {
			console.log(err);
			return APIResponse.errorResponse(res);
		}
	}

	async verifyAdminOtp(req, res) {
		const { otp, hash, email } = req.body;

		if (!otp || !hash || !email) {
			return res.status(400).json({ msg: "All Fields are required" });
		}

		const [hashedOtp, expires] = hash.split(".");

		if (Date.now() > +expires) {
			return res.status(400).json({ msg: "OTP Expired" });
		}

		const data = `${email}.${otp}.${expires}`;
		const isValid = await otpService.verifyOtp(hashedOtp, data);

		if (!isValid) {
			return res.status(400).json({ msg: "Invalid OTP" });
		}

		let user;

		try {
			user = await userService.findUser({ email });
			if (!user) {
				user = await userService.createUser({ email });
			}
		} catch (err) {
			console.log(err);
			return res.status(500).json({ msg: "Internal Server Error" });
		}

		// token
		const { accessToken, refreshToken } = tokenService.generateToken({ _id: user._id, activated: false });

		await tokenService.storeRefreshToken(refreshToken, user._id);

		res.cookie("accessCookie", accessToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true
		});

		res.cookie("refreshCookie", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true
		});

		res.json({ auth: true, user });

	}

	async refresh(req, res) {
		// getrefresh token from header
		const { dukaanRefreshCookie: refreshTokenFromCookie } = req.cookies;

		// check if token is valid
		let userData;
		try {
			userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
		} catch (err) {
			return res.status(401).json({ msg: "Invalid Token" });
		}

		// check the token is in the db
		try {
			const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
			if (!token) {
				return res.status(401).json({ msg: "Invalid Token" });
			}
		} catch (err) {
			return res.status(500).json({ msg: "Internal Server Error" });
		}

		// check valid user
		const user = await userService.findUser({ _id: userData._id });
		if (!user) {
			return res.status(404).json({ msg: "Invalid User" });
		}

		// generate new token
		const { accessToken, refreshToken } = tokenService.generateToken({ _id: userData._id });

		// update refresh token
		try {
			tokenService.updateRefreshToken(userData._id, refreshToken);
		} catch (err) {
			return res.status(500).json({ msg: "Internal Server Error" });
		}

		// put it in cookie
		res.cookie("dukaanAccessCookie", accessToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true
		});

		res.cookie("dukaanRefreshCookie", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true
		});

		// response
		res.json({ auth: true, user });
	}

	async logout(req, res) {
		const { dukaanRefreshCookie } = req.cookies;
		await tokenService.removeToken(dukaanRefreshCookie);

		res.clearCookie("dukaanRefreshCookie");
		res.clearCookie("dukaanAccessCookie");
		res.json({ user: null, auth: false });
	}

	async registerUser(req, res) {
		const { name, email, password, storeLink } = req.body;

		if (!name || !password || !email || !storeLink) {
			return res.status(400).json({ msg: "All Fields are required" });
		}

		try {

			let user = await userService.findEndUser({ email, storeLink });

			if (user) {
				return res.status(400).json({ msg: "User Already Exist" });
			}

			const shop = await userService.findUser({ storeLink });

			if (!shop) {
				return res.status(404).json({ msg: "Store Not Found" });
			} else {
				user = await userService.createEndUser({ name, email, password, storeLink });
				return res.status(200).json({ msg: "Registration Successfull", user });
			}

		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}

	async loginUser(req, res) {
		const { email, password, storeLink } = req.body;

		if (!password || !email || !storeLink) {
			return res.status(400).json({ msg: "All Fields are required" });
		}

		try {

			let user = await userService.findEndUser({ email, storeLink });

			if (!user) {
				return res.status(400).json({ msg: "User not found" });
			}

			if (user.password !== password) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			return res.status(200).json({ msg: "Login Successfull", user });

		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}

	async googleAuth(req, res) {
		passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
	}
}

module.exports = new AuthController();