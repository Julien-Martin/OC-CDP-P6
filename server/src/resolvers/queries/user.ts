import {Context} from "../../utils";

export const userQuery = {
    /**
     * Get current user profile
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    me: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id})
    },
    /**
     * Get current user products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meProducts: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).products()
    },

    meProduct: async(_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).products({where: {id: args.id}})
    },
    /**
     * Get current user clients
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClients: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).clients()
    },
    /**
     * Get one product by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClient: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).clients({where: {id: args.id}})
    },
    /**
     * Get current user invoices
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoices: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).invoices()
    },
    /**
     * Get one invoice by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoice: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).invoices({where: {id: args.id}})
    },
    /**
     * Get current user's estimates
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meEstimates: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).estimates()
    },
    /**
     * Get one estimate by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean|StorageEstimate|StorageEstimate>}
     */
    meEstimate: async (_, args, context: Context) => {
        return await context.prisma.user({id: context.user.id}).estimates({where: {id: args.id}})
    },
};