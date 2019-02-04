const {isAuth, isAdmin} = require('../utils')

module.exports = {
	user: async (_, args, context) => {
		const userId = isAuth(context)
		return context.prisma.product({id: _.id}).user()
	}
}