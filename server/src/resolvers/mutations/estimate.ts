import {Context, StateEnum} from "../../utils";
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
            const clientId = args.clientId;
            delete args.clientId;
            const client = await context.prisma.client({id: clientId}).$fragment(fragment.fragmentClient);
            if (!client) throw new Error("Client introuvable.");
            let products = args.products;

            args.products.forEach(item => {
                item.productId = item.product.id;
                item.quantity = parseInt(item.quantity);
                delete item.product
            });

            let price = 0;
            for (let i = 0; i < products.length; i++) {
                let productPrice = (await context.prisma.product({id: products[i].productId}).$fragment(fragment.fragmentProductOnlyPrice))["pricettc"];
                products[i].product = {connect: {id: products[i].productId}};
                delete products[i].productId;
                price += productPrice * products[i].quantity
            }
            delete args.products;

            args.startedDate = new Date(args.startedDate).toISOString();
            args.deliveryDate = new Date(args.deliveryDate).toISOString();
            args.validityDate = new Date(args.deliveryDate).toISOString();

            return await context.prisma.createEstimate({
                ...args,
                state: "DRAFT",
                userId: context.user.id,
                user: {
                    connect: {id: context.user.id}
                },
                client: {
                    connect: {id: clientId}
                },
                products: {
                    create: products
                },
                price
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
            const id = args.id;
            delete args.id;
            const estimateState = await context.prisma.estimate({id: id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState['state'] !== StateEnum["0"]) throw ("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");

            let products = args.products;
             let price = 0;
            if (args.products) {

                products.forEach(item => {
                    item.productId = item.product.id;
                    item.quantity = parseInt(item.quantity);
                    delete item.product
                });

                await context.prisma.updateEstimate({
                    where: {id: id},
                    data: {products: {deleteMany: {quantity_not: 0}}}
                });
                for (let i = 0; i < products.length; i++) {
                    let productPrice = (await context.prisma.product({id: products[i].productId}).$fragment(fragment.fragmentProductOnlyPrice))["pricettc"];
                    products[i].product = {connect: {id: products[i].productId}};
                    delete products[i].productId;
                    price += productPrice * products[i].quantity
                }
                delete args.products
            }

            args.startedDate = new Date(args.startedDate).toISOString();
            args.deliveryDate = new Date(args.deliveryDate).toISOString();
            args.validityDate = new Date(args.deliveryDate).toISOString();

            await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    estimates: {
                        update: {
                            where: {id},
                            data: {
                                ...args,
                                price,
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
     * Change estimate state to "PENDING" and copy User, Client and Product info to StaticUser, StaticClient and StaticProducts
     * An estimate with state different of "DRAFT" cannot be change
     * @param _
     * @param args
     * @param context
     */
    validateEstimate: async(_, args, context: Context) => {
        try {
            const estimateState = await context.prisma.estimate({id: args.id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState['state'] !== StateEnum["0"]) throw ("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let client = await context.prisma.estimate({id: args.id}).client();
            let staticUser = await context.prisma.estimate({id: args.id}).user().$fragment(fragment.fragmentUser);
            let staticClient = await context.prisma.estimate({id: args.id}).client().$fragment(fragment.fragmentClient);
            let staticProducts = await context.prisma.estimate({id: args.id}).products().$fragment(fragment.fragmentEnsureProduct);
            const estimateCounter = await context.prisma.estimatesConnection({where: {estimateNumber_gt: ""}}).aggregate().count();
            const estimateNumber = moment().format('YYYY-MM-') + ("000" + (estimateCounter + 1)).slice(-4);
            await context.prisma.updateClient({
                where: {id: client.id},
                data: {
                    estimates: {
                        disconnect: [{id: args.id}]
                    }
                }
            });
            console.log(typeof staticProducts)
            // @ts-ignore
            return await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    estimates: {
                        // @ts-ignore
                        update: {
                            where: {id: args.id},
                            data: {
                                products: {
                                    deleteMany: {
                                        quantity_not: -1
                                    }
                                },
                                staticUser,
                                staticClient,
                                staticProducts: {
                                    create: staticProducts
                                },
                                estimateNumber,
                                state: StateEnum[1]
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
     * Change estimate state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    changeEstimateState: async (_, args, context: Context) => {
        try {
            return await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    estimates: {
                        update: {
                            where: {id: args.id},
                            data: {
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
        try {
            const estimateState = await context.prisma.estimate({id: args.id}).$fragment(fragment.fragmentEstimateState);
            if (estimateState['state'] !== StateEnum["0"]) throw ("Vous ne pouvez pas supprimer un devis déjà validé. ");
            await context.prisma.updateUser({
                where: {id: context.user.id},
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