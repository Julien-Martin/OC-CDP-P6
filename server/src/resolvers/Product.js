const {isAuth, isAdmin} = require('../middlewares/utils');

module.exports = {
	/**
	 * Return user info in Product Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context) => {
		const userId = await isAuth(context);
		return context.prisma.product({id: _.id}).user()
	}
};