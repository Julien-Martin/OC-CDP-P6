const StatusModel = require('../models/Status');

module.exports = {
	findAll : (req, res) => {
		StatusModel.find({}, (err, results) => {
			if(err) return res.send(err);
			return res.send(results);
		})
	},
	findOne: (req, res) => {
		StatusModel.findOne({_id: req.params.id}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	create: (req, res) => {
		StatusModel.create(req.body, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	update: (req, res) => {
		StatusModel.updateOne({_id: req.params.id}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	delete: (req, res) => {
		StatusModel.deleteOne({_id: req.params.id}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
};
