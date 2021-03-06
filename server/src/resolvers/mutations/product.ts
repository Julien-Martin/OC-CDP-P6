import {Context} from '../../utils'
import {ErrorHandling} from "../../utils/errors";

export const productMutation = {
    /**
     * Create product for current user
     * @param _
     * @param args
     * @param context
     */
    createProduct: async (_, args, context: Context) => {
        try {
            const priceht = Math.round((args.pricettc / (1 + args.vat / 100)) * 100) / 100;
            return await context.prisma.createProduct({
                ...args,
                priceht: priceht,
                user: {
                    connect: {
                        id: context.user.id
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
        const id = args.id;
        delete args.id;
        try {
            const priceht = args.pricettc / (1 + args.vat / 100);
            await context.prisma.updateUser({
                where: {id: context.user.id},
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
        try {
            let estimateCounter = (await context.prisma.estimates({where: {products_some: {product: {id: args.id}}}})).length;
            let invoiceCounter = (await context.prisma.invoices({where: {products_some: {product: {id: args.id}}}})).length;
            if(estimateCounter) throw("Ce produit est associé a des devis.");
            if(invoiceCounter) throw("Ce produit est associé a une facture.");
            await context.prisma.updateUser({
                where: {id: context.user.id},
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
            throw new ErrorHandling("PRODUCT003", e)
        }
    },
};