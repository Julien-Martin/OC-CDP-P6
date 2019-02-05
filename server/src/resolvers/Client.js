const {isAuth, isAdmin} = require('../utils');

module.exports = {
	/**
	 * Return LegalForm for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>>}
	 */
	legalForm: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.client({id: _.id}).legalForm()
	},
	/**
	 * Return User for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.client({id: _.id}).user()
	},
	/**
	 * Return Invoices for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoices: async (_, args, context) => {
		const userId = isAuth(context);
		return context.prisma.client({id: _.id}).invoices()
	}
};