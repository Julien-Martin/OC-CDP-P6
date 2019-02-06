import {Context, isAuth} from "../utils";

export const User = {
	/**
	 * Return products in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>>}
	 */
	products: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.user({id: _.id}).products()
	},
	/**
	 * Return clients in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	clients: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.user({id: _.id}).clients()
	},
	/**
	 * Return invoices in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoices: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.user({id: _.id}).invoices()
	},
	/**
	 * Return estimates in User Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	estimates: async(_, args, context: Context) => {
		const userId = await isAuth(context)
		return context.prisma.user({id: _.id}).estimates()
	}
};