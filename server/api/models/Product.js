const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	description: {
		type: String,
		required: true
	},
	priceht: {
		type: Number,
		required: true
	},
	vat: {
		type: Number,
		enum: [0, 2.1, 5.5, 10, 20],
		required: true
	},
	unit: {
		type: String,
	},
	pricettc: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Product', productSchema);