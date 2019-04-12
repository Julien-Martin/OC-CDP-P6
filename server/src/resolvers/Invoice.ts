import {Context, isAuth} from "../utils";

export const Invoice = {
    /**
     * Return user info in Invoice Query
     * @param _
     * @param args
     * @param context
     */
    user: async(_, args, context: Context) => {
        const userId = await isAuth(context);
        return context.prisma.invoice({id: _.id}).user()
    },
    /**
     * Return client info in Invoice Query
     * @param _
     * @param args
     * @param context
     */
    client: async(_, args, context: Context) => {
        const userId = await isAuth(context);
        return context.prisma.invoice({id: _.id}).client()
    },
    /**
     * Return Product info in Invoice Query
     * @param _
     * @param args
     * @param context
     * @param info
     */
    products: async(_, args, context: Context, info) => {
        const userId = await isAuth(context);
        return await context.prisma.invoice({id: _.id}).products().$fragment(`
            fragment EnsureProduct on Invoice {
                product {
                    id
                    description
                    priceht
                    pricettc
                    vat
                    unit
                }
                quantity
            }
        `)
    }
};