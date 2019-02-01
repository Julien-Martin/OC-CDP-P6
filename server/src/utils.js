const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
	getUserId: (context) => {
		const Authorization = context.request.get('Authorization');
		if (Authorization) {
			const token = Authorization.replace('Bearer ', '');
			const {id} = jwt.verify(token, process.env.JWT_SECRET);
			return id
		}
		throw new Error('Not authenticated')
	},
	getUserForDocument: (userArg) => {
		const user = {};
		user.firstname = userArg.firstname;
		user.lastname = userArg.lastname;
		user.address = userArg.address;
		user.commercialName = userArg.commercialName;
		user.siret = userArg.siret;
		user.RCS = userArg.RCS;
		user.RM = userArg.RM;
		return user
	},
	getClientForDocument: (clientArg) => {
		const client = {};
		client.firstname = clientArg.firstname;
		client.lastname = clientArg.lastname;
		client.status = clientArg.status;
		client.company = clientArg.company;
		client.address = clientArg.address;
		client.phone = clientArg.phone;
		return client
	},
	getProductForDocument: (productArg) => {
		const product = {};
		product.description = productArg.description;
		product.priceht = productArg.priceht;
		product.vat = productArg.vat;
		product.pricettc = productArg.pricettc;
		product.unit = productArg.unit;
		return product
	},
	getPrice: (products) => {
		let price = 0;
		products.forEach(item => {
			price += item.product.pricettc * item.quantity
		});
		return price
	}
};
