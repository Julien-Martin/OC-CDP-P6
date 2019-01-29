const InvoiceModel = require('../models/Invoice');

module.exports = {
	findMyInvoices: (req, res) => {
		InvoiceModel.find({_userId: req.user._id}, (err, results) => {
			if(err) return res.send(err);
			return res.send(results);
		})
	},
	findOne: (req, res) => {
		InvoiceModel.findOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	findAllFromClient: (req, res) => {
		InvoiceModel.find({
			$and: [{_clientId: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	create: (req, res) => {
		req.body._userId = req.user._id;
		InvoiceModel.create(req.body, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	}
};