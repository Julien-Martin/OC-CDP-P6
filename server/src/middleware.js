const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = async (resolve, root, args, context, info) => {
	const Authorization = context.request.get('Authorization')
	if(Authorization) {
		const token = Authorization.replace('Bearer ', '')
		const {id} = jwt.verify(token, process.env.JWT_SECRET)
		return resolve()
	}
	throw new Error('Not authenticated')
};