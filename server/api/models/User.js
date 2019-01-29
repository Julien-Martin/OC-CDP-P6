const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
	isAdmin: {
		type: Boolean,
		default: false
	},
	lastname: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	mail: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	siret: {
		type: String,
		unique: true,
		required: true
	},
	ape: String,
	useVAT: {
		type: Boolean,
		required: true,
		default: false
	},
	paymentInfo: String,
	VATnumber: String,
	RCS: String,
	RM: String,
	commercialName: String,
});

userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password, callback) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);