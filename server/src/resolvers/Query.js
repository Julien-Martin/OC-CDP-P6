const {isAuth, isAdmin} = require('../utils');

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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
		return await context.prisma.legalForm({id: args.id})
	},
	/**
	 * Get all Invoices
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoices: async (_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.invoices()
	},
	/**
	 * Get one Invoice by ID
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoice: async (_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.invoice({id: args.id})
	},
	/**
	 * Get all invoices by User ID
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoicesByUser: async(_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.user({id: args.id}).invoices()
	},
	/**
	 * Get all estimates
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Estimate>}
	 */
	estimates: async(_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.estimates()
	},
	/**
	 * Get one estimates by ID
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|boolean|StorageEstimate>}
	 */
	estimate: async(_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.estimate({id: args.id})
	},
	/**
	 * Get all estimates by User ID
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	estimatesByUser: async(_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: args.id}).estimates()
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
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
		const userId = isAuth(context);
		return await context.prisma.user({id: userId}).clients()
	},
	/**
	 * Get one product by ID and only from current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meClient: async(_, args, context) => {
		const userID = isAuth(context);
		return await context.prisma.user({id: userID}).product({id: args.id})
	},
	/**
	 * Get current user invoices
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meInvoices: async(_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.user({id: userId}).invoices()
	},
	/**
	 * Get one invoice by ID and only from current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meInvoice: async(_, args, context) => {
		const userId = isAuth(context);
		return await context.prisma.user({id: userId}).invoice({id: args.id})
	},
	/**
	 * Get current user's estimates
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	meEstimates: async(_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userId}).estimates()
	},
	/**
	 * Get one estimate by ID and only from current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|boolean|StorageEstimate|StorageEstimate>}
	 */
	meEstimate: async(_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.user({id: userid}).estimate({id: args.id})
	},
};