import {Context, isAuth, StateEnum} from "../../utils";
import {fragment} from '../../utils/fragments'
import * as moment from 'moment'
import {ErrorHandling} from "../../utils/errors";

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
            const client = await context.prisma.client({id: clientId}).$fragment(fragment.fragmentClient);
            if (!client) throw new Error("Client introuvable.");
            let products = args.products;
            let price = 0;

            for (let i = 0; i < products.length; i++) {
                let productPrice = (await context.prisma.product({id: products[i].productId}).$fragment(fragment.fragmentProductOnlyPrice))["pricettc"]
                products[i].product = {connect: {id: products[i].productId}}
                delete products[i].productId
                price += productPrice * products[i].quantity
            }
            delete args.products
            const estimateCounter = await context.prisma.estimatesConnection({where: {userId}}).aggregate().count()
            const estimateNumber = moment().format('YYYY-MM-') + ("000" + (estimateCounter + 1)).slice(-4)
            return await context.prisma.createEstimate({
                ...args,
                state: "DRAFT",
                userId,
                user: {
                    connect: {id: userId}
                },
                client: {
                    connect: {id: clientId}
                },
                products: {
                    create: products
                },
                price,
                estimateNumber
            })
        } catch (e) {
            throw new ErrorHandling("ESTIMATE001", e.message)
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
        try {
            const userId = await isAuth(context);
            const id = args.id;
            delete args.id;
            const estimateState = await context.prisma.estimate({id: id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState['state'] !== StateEnum["0"]) throw ("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");

            let products = args.products;
            args.price = 0
            if (products) {
                await context.prisma.updateEstimate({
                    where: {id: id},
                    data: {products: {deleteMany: {quantity_not: 0}}}
                })
                for (let i = 0; i < products.length; i++) {
                    let productPrice = (await context.prisma.product({id: products[i].productId}).$fragment(fragment.fragmentProductOnlyPrice))["pricettc"]
                    products[i].product = {connect: {id: products[i].productId}}
                    delete products[i].productId
                    args.price += productPrice * products[i].quantity
                }
                delete args.products
            }

            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    estimates: {
                        update: {
                            where: {id},
                            data: {
                                ...args,
                                price: args.price,
                                products: {
                                    create: products
                                },
                            }
                        }
                    }
                }
            });
            return await context.prisma.estimate({id})
        } catch (e) {
            throw new ErrorHandling("ESTIMATE002", e.message)
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
            let staticUser = await context.prisma.estimate({id: args.id}).user().$fragment(fragment.fragmentUser)
            let staticClient = await context.prisma.estimate({id: args.id}).client().$fragment(fragment.fragmentClient)
            let products = await context.prisma.estimate({id: args.id}).products().$fragment(fragment.fragmentEnsureProduct)
            return await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    estimates: {
                        update: {
                            where: {id: args.id},
                            data: {
                                staticUser,
                                staticClient,
                                staticProducts: {
                                    create : products
                                },
                                state: StateEnum[args.state]
                            }
                        }
                    }
                }
            })
        } catch (e) {
            throw new ErrorHandling("ESTIMATE003", e.message)
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
            if (estimateState['state'] !== StateEnum["0"]) throw ("Vous ne pouvez pas supprimer un devis déjà validé. ");
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
            throw new ErrorHandling("ESTIMATE004", e.message)
        }
    },
};