const fs = require("fs");
const crypto = require("crypto");
const readline = require("readline-sync");

var current_date = (new Date()).valueOf().toString();
var random1 = Math.random().toString();
var random2 = Math.random().toString();
var random3 = Math.random().toString();
const hash1 = crypto.createHash("sha1").update(current_date + random1).digest("hex");
const hash2 = crypto.createHash("sha1").update(current_date + random2).digest("hex");
const hash3 = crypto.createHash("sha1").update(current_date + random3).digest("hex");

fs.appendFile(".env.local", `HASH_SECRET=${hash1}\n`, function (err) {
	if (err) throw err;
	console.log("✅ Hash Secret Generated!");
});

fs.appendFile(".env.local", `JWT_ACCESS_TOKEN_SECRET=${hash2}\n`, function (err) {
	if (err) throw err;
	console.log("✅ JWT ACCESS TOKEN Generated!");
});

fs.appendFile(".env.local", `JWT_REFRESH_TOKEN_SECRET=${hash3}\n`, function (err) {
	if (err) throw err;
	console.log("✅ JWT REFRESH TOKEN Generated!");
});

let port = Number(readline.question("Enter port number: "));
let mongodb_url = readline.question("Enter MONGO ATLAS URL: ");

fs.appendFile(".env.local", `PORT=${port}\n`, function (err) {
	if (err) throw err;
	console.log(`✅ PORT ${port} Generated!`);
});

fs.appendFile(".env.local", `MONGODB_URI=${mongodb_url}\n`, function (err) {
	if (err) throw err;
	console.log("✅ MONGODB URL Added!");
});