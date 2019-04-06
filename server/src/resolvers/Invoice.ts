import {Context, isAuth} from "../utils";

export const Invoice = {
    user: async(_, args, context: Context) => {
        const userId = await isAuth(context)
        return context.prisma.invoice({id: _.id}).user()
    },
    client: async(_, args, context: Context) => {
        const userId = await isAuth(context)
        return context.prisma.invoice({id: _.id}).client()
    },
    products: async(_, args, context: Context, info) => {
        const userId = await isAuth(context)
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
}