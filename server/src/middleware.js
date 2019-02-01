const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = async (resolve, root, args, context, info) => {
	const Authorization = context.request.get('Authorization')
	if(Authorization) {
		const token = Authorization.replace('Bearer ', '')
		args.user = jwt.verify(token, process.env.JWT_SECRET)
		return await resolve(root, args, context, info)
	}
	return false
};