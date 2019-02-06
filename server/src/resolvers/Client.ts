import {Context, isAuth} from "../utils";

export const Client = {
	/**
	 * Return LegalForm for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>>}
	 */
	legalForm: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.client({id: _.id}).legalForm()
	},
	/**
	 * Return User for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	user: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.client({id: _.id}).user()
	},
	/**
	 * Return Invoices for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	invoices: async (_, args, context: Context) => {
		const userId = await isAuth(context);
		return context.prisma.client({id: _.id}).invoices()
	},
	/**
	 * Return Estimates for Client Query
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	estimates: async(_, args, context: Context) => {
		const userId = await isAuth(context)
		return context.prisma.client({id: _.id}).estimates()
	}
};