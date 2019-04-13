import {Context, isAuth, isAdmin} from "../../utils";

export const adminQuery = {
    /**
     * Get all users
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */

    users: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.users()
    },
    /**
     * Get one user by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    user: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.user({id: args.id})
    },
    /**
     * Get all products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    products: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.products()
    },
    /**
     * Get one product by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    product: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.product({id: args.id})
    },

    /**
     * Get all clients
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    clients: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.clients()
    },
    /**
     * Get one client by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    client: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.product({id: args.id})
    },
    /**
     * Get all Legal Form
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    legalForms: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.legalForms()
    },
    /**
     * Get one Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    legalForm: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return await context.prisma.legalForm({id: args.id})
    },
    /**
     * Get all Invoices
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoices: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.invoices()
    },
    /**
     * Get one Invoice by ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoice: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.invoice({id: args.id})
    },
    /**
     * Get all invoices by User ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoicesByUser: async(_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.user({id: args.id}).invoices()
    },
    /**
     * Get all estimates
     * @param _
     * @param args
     * @param context
     */
    estimates: async(_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.estimates()
    },
    /**
     * Get one estimates by ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean|StorageEstimate>}
     */
    estimate: async(_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.estimate({id: args.id})
    },
    /**
     * Get all estimates by User ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    estimatesByUser: async(_, args, context: Context) => {
        const userId = await isAdmin(context);
        return await context.prisma.user({id: args.id}).estimates()
    },
};