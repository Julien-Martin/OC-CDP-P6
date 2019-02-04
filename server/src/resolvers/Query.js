const {isAuth, isAdmin} = require('../utils')

module.exports = {
	users: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.users()
	},
	user: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: args.id})
	},
	products: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.products()
	},
	product: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.product({id: args.id})
	},
	productsByUser: async(_, args, context, info) => {
		const userId = isAuth(context)
		return await context.prisma.products({where: {user: {id: userId}}}, info)
	},

	me: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId})
	},
	meProducts: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId}).products()
	}
}