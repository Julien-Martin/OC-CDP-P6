const ClientModel = require('../models/Client');

module.exports = {
	findMyClients: (req, res) => {
		ClientModel.find({_userId: req.user._id}, (err, results) => {
			if(err) return res.send(err);
			return res.send(results);
		})
	},
	findOne: (req, res) => {
		ClientModel.findOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	create: (req, res) => {
		req.body._userId = req.user._id;
		ClientModel.create(req.body, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	update: (req, res) => {
		ClientModel.updateOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	delete: (req, res) => {
		ClientModel.deleteOne({
			$and: [{_id: req.params.id}, {_userId: req.user._id}]
		}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	}
};