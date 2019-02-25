import {Context, isAuth} from "../../utils";
import {fragment} from "../../utils/fragments";

export const userQuery = {
    hello: async(_, args, context: Context) => {
      return 'Hello world'
    },
    /**
     * Get current user profile
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    me: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId})
    },
    /**
     * Get current user products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meProducts: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).products()
    },
    /**
     * Get current user clients
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClients: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).clients()
    },
    /**
     * Get one product by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClient: async (_, args, context: Context) => {
        const userID = await isAuth(context);
        return await context.prisma.user({id: userID}).products({where: {id: args.id}})
    },
    /**
     * Get current user invoices
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoices: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).invoices()
    },
    /**
     * Get one invoice by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoice: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).invoices({where: {id: args.id}})
    },
    /**
     * Get current user's estimates
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meEstimates: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).estimates()
    },
    /**
     * Get one estimate by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean|StorageEstimate|StorageEstimate>}
     */
    meEstimate: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.user({id: userId}).estimates({where: {id: args.id}})
    },
};