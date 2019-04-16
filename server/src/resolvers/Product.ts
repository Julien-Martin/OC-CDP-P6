import {Context} from "../utils";

export const Product = {
	/**
	 * Return user info in Product Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context: Context) => {
		return context.prisma.product({id: _.id}).user()
	}
};