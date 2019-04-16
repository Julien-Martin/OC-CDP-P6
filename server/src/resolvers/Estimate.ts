import {Context} from "../utils";

export const Estimate = {
    /**
     * Return User info in Estimate Query
     * @param _
     * @param args
     * @param context
     */
    user: async (_, args, context: Context) => {
        return context.prisma.estimate({id: _.id}).user()
    },
    /**
     * Return Client info in Estimate Query
     * @param _
     * @param args
     * @param context
     */
    client: async (_, args, context: Context) => {
        return context.prisma.estimate({id: _.id}).client()
    },
    /**
     * Return Product info in Estimate Query
     * @param _
     * @param args
     * @param context
     * @param info
     */
    products: async (_, args, context: Context, info) => {

        return await context.prisma.estimate({id: _.id}).products().$fragment(`
            fragment EnsureProduct on Estimate {
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