const ShopkeeperModel = require("../models/shopkeeper-model");
const UserModel = require("../models/user-model");
const hashService = require("./hash-service");

class UserService {
	async findUser(filter) {
		const user = await ShopkeeperModel.findOne(filter);
		return user;
	}

	async getAllUsers() {
		try {
			const users = await ShopkeeperModel.find();
			return users;
		} catch (err) {
			return err;
		}
	}

	async createUser(data) {
		data.password = hashService.hashPassword(data.password);
		const user = await ShopkeeperModel.create(data);
		return user;
	}

	async findEndUser(filter) {
		try {
			const users = await UserModel.findOne(filter);
			return users;
		} catch (err) {
			return err;
		}
	}

	async getAllEndUser(filter) {
		const user = await UserModel.find(filter);
		return user;
	}

	async createEndUser(data) {
		const user = await UserModel.create(data);
		return user;
	}
}

module.exports = new UserService();