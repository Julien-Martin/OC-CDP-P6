const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		required: true
	},
	status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Status',
		required: true
	},
	mail: String,
	address: String,
	phone: String,
	company: String
});

module.exports = mongoose.model('Client', clientSchema);