const {isAuth, isAdmin} = require('../utils')

module.exports = {
	/**
	 * ADMIN
	 */
	/**
	 * Get all users
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	users: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.users()
	},
	/**
	 * Get one user by id
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: args.id})
	},
	/**
	 * Get all products
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	products: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.products()
	},
	/**
	 * Get one product by id
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	product: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.product({id: args.id})
	},
	/**
	 * Get all product by user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	productsByUser: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.products({where: {user: {id: args.id}}})
	},
	/**
	 * Get all clients
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	clients: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.clients()
	},
	/**
	 * Get one client by id
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	client: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.product({id: args.id})
	},
	/**
	 * Get all client by user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>>}
	 */
	clientsByUser: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.products({where: {user: {id: args.id}}})
	},
	/**
	 * Get all Legal Form
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	legalForms: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.legalForms()
	},
	/**
	 * Get one Legal Form by id
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	legalForm: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.legalForm({id: args.id})
	},

	/**
	 * Standard user
	 */
	/**
	 * Get current user profile
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	me: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId})
	},
	/**
	 * Get current user products
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meProducts: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId}).products()
	},
	/**
	 * Get current user clients
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meClients: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId}).clients()
	},
}