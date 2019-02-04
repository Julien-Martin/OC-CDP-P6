const {isAuth, isAdmin} = require('../utils')

module.exports = {
	products: async (_, args, context) => {
		const userId = isAuth(context)
		return context.prisma.user({id: _.id}).products()
	}
}