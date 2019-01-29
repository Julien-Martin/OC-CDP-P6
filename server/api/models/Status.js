const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
	form: {
		type: String,
		unique: true,
		required: true
	},
	title: {
		type: String,
		unique: true,
		required: true
	}
});

module.exports = mongoose.model('Status', statusSchema);