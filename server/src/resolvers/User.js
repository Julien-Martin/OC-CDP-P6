const {isAuth, isAdmin} = require('../utils');

module.exports = {
	/**
	 * Return products in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>>}
	 */
	products: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.user({id: _.id}).products()
	},
	/**
	 * Return clients in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	clients: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.user({id: _.id}).clients()
	},
	invoices: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.user({id: _.id}).invoices()
	}
};