const User = require('../models/user');
function delteingToken() {
	let currentDate = new Date().toISOString();
	User.find({ resetTokenExpiration: { $lte: currentDate } }).then((users) => {
		if (users.length > 0)
			users.forEach((user) => {
				user.resetToken = undefined;
				user.resetTokenExpiration = undefined;
				user.save();
			});
	});
}
module.exports = delteingToken;
