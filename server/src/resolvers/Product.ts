import {Context, isAuth} from "../utils";

export const Product = {
	/**
	 * Return user info in Product Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.product({id: _.id}).user()
	}
};