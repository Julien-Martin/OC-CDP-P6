const UserModel = require('../models/User');

module.exports = {
	findMe: (req, res) => {
		UserModel.findOne({_id: req.user._id}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	update: (req, res) => {
		UserModel.updateOne({_id: req.user._id}, req.body, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	},
	delete: (req, res) => {
		UserModel.deleteOne({_id: req.user._id}, (err, result) => {
			if(err) return res.send(err);
			return res.send(result);
		})
	}
};