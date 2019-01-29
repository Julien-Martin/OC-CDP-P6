const ProductModel = require('../models/Product');

module.exports = {
	findMyProducts: (req, res) => {
		ProductModel.find({_userId: req.user._id}, (err, results) => {
			if(err) return res.send(err);
			return res.send(results);
		})
	},
	findOne: (req, res) => {
		ProductModel.findOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	create: (req, res) => {
		req.body._userId = req.user._id;
		ProductModel.create(req.body, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	update: (req, res) => {
		ProductModel.updateOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	delete: (req, res) => {
		ProductModel.deleteOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	}
};