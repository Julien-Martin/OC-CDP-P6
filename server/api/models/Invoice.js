const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	_clientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client',
		required: true
	},
	invoiceNumber: {
		type: String,
		required: true
	},
	creationDate: {
		type: Date,
		required: true
	},
	deliveryDate: {
		type: Date,
		required: true
	},
	paymentDate: {
		type: Date,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	products: [{
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
		pricettc: {
			type: Number,
			required: true
		},
		quantity: Number
	}],
	latePenality: Number,
});

module.exports = mongoose.model('Invoice', invoiceSchema);