import {Context, isAuth} from '../../utils'
import {ErrorHandling} from "../../utils/errors";

export const productMutation = {
    createProduct: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        try {
            const priceht = Math.round((args.pricettc / (1 + args.vat / 100)) * 100) / 100;
            return await context.prisma.createProduct({
                ...args,
                priceht: priceht,
                user: {
                    connect: {
                        id: userId
                    }
                },
            })
        } catch (e) {
            throw new ErrorHandling("PRODUCT001", e.message)
        }
    },
    /**
     * Update product by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    updateProduct: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        const id = args.id;
        delete args.id;
        try {
            const priceht = args.pricettc / (1 + args.vat / 100);
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    products: {
                        update: {
                            where: {id: id},
                            data: {
                                ...args,
                                priceht: priceht
                            }
                        }
                    }
                }
            });
            return await context.prisma.product({id: id})
        } catch (e) {
            throw new ErrorHandling("PRODUCT002", e.message)
        }
    },
    /**
     * Delete product by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteProduct: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        try {
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    products: {
                        delete: {
                            id: args.id
                        }
                    }
                }
            });
            return true
        } catch (e) {
            throw new ErrorHandling("PRODUCT003", e.message)
        }
    },
};