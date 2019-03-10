import {Context, isAuth} from "../utils";

export const Estimate = {
    user: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return context.prisma.estimate({id: _.id}).user()
    },
    client: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        return context.prisma.estimate({id: _.id}).client()
    },
    products: async (_, args, context: Context, info) => {
        const userId = await isAuth(context)

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
}