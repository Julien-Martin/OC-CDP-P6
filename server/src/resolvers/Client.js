const {isAuth, isAdmin} = require('../utils')

module.exports = {
	/**
	 * Return LegalForm for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>|Promise<boolean>|LegalFormPromise|LegalFormSubscriptionPayloadSubscription|never|LegalFormSubscription>}
	 */
	legalForm: async (_, args, context) => {
		const userId = isAuth(context)
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
		const userId = isAuth(context)
		return context.prisma.client({id: _.id}).user()
	}
}