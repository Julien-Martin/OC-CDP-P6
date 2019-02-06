import {Context, isAuth, StateEnum} from "../../utils";
import {fragment} from '../../fragments'
import * as moment from 'moment'

export const estimateMutation = {
    /**
     * Create estimate with static client user and products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createEstimate: async (_, args, context: Context) => {
        try {
            const userId = await isAuth(context);
            const clientId = args.clientId;
            delete args.clientId;
            const user = await context.prisma.user({id: userId}).$fragment(fragment.fragmentUser);
            if(!user) throw new Error("Utilisateur introuvable.")
            const client = await context.prisma.client({id: clientId}).$fragment(fragment.fragmentClient);
            if(!client) throw new Error("Client introuvable.")
            const products = args.products;
            let price = 0;
            for (let i = 0; i < products.length; i++) {
                products[i].product = await context.prisma.product({id: products[i].product}).$fragment(fragment.fragmentProduct);
                price += products[i].product.pricettc * products[i].quantity
            }
            const estimateCounter = await context.prisma.estimatesConnection({where: {userId}}).aggregate().count();
            const estimateNumber = moment().format('YYYY-MM-') + (estimateCounter + 1);
            const estimate = await context.prisma.createEstimate({
                ...args,
                state: 'DRAFT',
                userId,
                user,
                client,
                price,
                estimateNumber,
                products: {
                    create: products
                }
            });
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    estimates: {
                        connect: {id: estimate.id}
                    }
                }
            });
            await context.prisma.updateClient({
                where: {id: clientId},
                data: {
                    estimates: {
                        connect: {id: estimate.id}
                    }
                }
            });
            return estimate
        } catch (e) {
            throw new Error("Impossible de créer un devis. " + e)
        }
    },
    /**
     * Update estimate by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    updateEstimate: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        const id = args.id;
        delete args.id;
        if (args.products) {
            for (let i = 0; i < args.products.length; i++) {
                args.products[i].product = await context.prisma.product({id: args.products[i].product}).$fragment(fragment.fragmentProduct);
                args.price += args.products[i].product.pricettc * args.products[i].quantity
            }
        }
        try {
            const estimateState = await context.prisma.estimate({id: id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState.state !== "DRAFT") throw new Error("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    estimates: {
                        update: {
                            where: {id},
                            data: {
                                ...args,
                                products: {
                                    create: args.products
                                }
                            }
                        }
                    }
                }
            });
            return await context.prisma.estimate({id})
        } catch (e) {
            throw new Error("Impossible de mettre à jour. " + e)
        }
    },
    /**
     * Change estimate state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    changeEstimateState: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        try {
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    invoices: {
                        update: {
                            where: {id: args.id},
                            data: {state: StateEnum[args.state]}
                        }
                    }
                }
            })
        } catch (e) {
            throw new Error("Impossible de valider. " + e)
        }
    },
    /**
     * Delete estimate by id for current user only if state != DRAFT
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteEstimate: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        try {
            const estimateState = await context.prisma.estimate({id: args.id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState.state !== StateEnum["0"]) throw new Error("Vous ne pouvez pas supprimer un devis déjà validé. ");
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    estimates: {
                        delete: {id: args.id}
                    }
                }
            });
            return true
        } catch (e) {
            throw new Error("Impossible de supprimer. " + e)
        }
    },
}