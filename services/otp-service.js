const crypto = require("crypto");
const hashService = require("./hash-service");

class OtpService {
	async generateOtp() {
		const otp = crypto.randomInt(1000, 9999);
		return otp;
	}

	// async sendBySms(phone, otp) {
	//     return await twilio.messages.create({
	//         to: phone,
	//         from: smsNumber,
	//         body: `Your DevHouse OTP is ${otp}.`
	//     })
	// }

	async verifyOtp(hashedOtp, data) {
		let computedHash = hashService.hashOtp(data);
		return computedHash === hashedOtp;
	}
}

module.exports = new OtpService();