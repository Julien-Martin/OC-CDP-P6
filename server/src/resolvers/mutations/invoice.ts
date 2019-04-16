import {Context, StateEnum} from "../../utils";
import * as moment from 'moment'
import {fragment} from '../../utils/fragments'
import {ErrorHandling} from "../../utils/errors";

export const invoiceMutation = {
    /**
     * Create invoice with static client user and products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createInvoice: async (_, args, context: Context) => {
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

            let deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
            args.billingDate = new Date(args.billingDate).toISOString();
            args.deadline = new Date(deadline.toString()).toISOString();

            return await context.prisma.createInvoice({
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
            throw new ErrorHandling("INVOICE001", e.message)
        }
    },
    /**
     * Update invoice by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean>}
     */
    updateInvoice: async (_, args, context: Context) => {
        try {
            let id = args.id;
            delete args.id;
            let invoiceState = await context.prisma.invoice({id: id}).$fragment(fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== StateEnum["0"]) throw ("Cette facture a déjà été validé, vous ne pouvez donc pas le modifier. ");

            let products = args.products;
            let price = 0;
            if (args.products) {
                products.forEach(item => {
                    item.productId = item.product.id;
                    item.quantity = parseInt(item.quantity);
                    delete item.product
                });

                await context.prisma.updateInvoice({
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
            let deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
            args.billingDate = new Date(args.billingDate).toISOString();
            args.deadline = new Date(deadline.toString()).toISOString();

            await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    invoices: {
                        update: {
                            where: {id},
                            data: {
                                ...args,
                                price,
                                products: {
                                    create: products
                                }
                            }
                        }
                    }
                }
            });
            return await context.prisma.invoice({id})
        } catch (e) {
            throw new ErrorHandling("INVOICE002", e.message)
        }
    },

    /**
     * Change invoice state to "PENDING" and copy User, Client and Product info to StaticUser, StaticClient and StaticProducts
     * An invoice with state different of "DRAFT" cannot be change
     * @param _
     * @param args
     * @param context
     */
    validateInvoice: async (_, args, context: Context) => {
        try {
            const invoiceState = await context.prisma.invoice({id: args.id}).$fragment(fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== StateEnum["0"]) throw ("Cette facture a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let client = await context.prisma.invoice({id: args.id}).client();
            let staticUser = await context.prisma.invoice({id: args.id}).user().$fragment(fragment.fragmentUser);
            let staticClient = await context.prisma.invoice({id: args.id}).client().$fragment(fragment.fragmentClient);
            let staticProducts = await context.prisma.invoice({id: args.id}).products().$fragment(fragment.fragmentEnsureProduct);
            const invoiceCounter = await context.prisma.invoicesConnection({where: {invoiceNumber_gt: ""}}).aggregate().count();
            const invoiceNumber = moment().format('YYYY-MM-') + ("000" + (invoiceCounter + 1)).slice(-4);
            await context.prisma.updateClient({
                where: {id: client.id},
                data: {
                    invoices: {
                        disconnect: [{id: args.id}]
                    }
                }
            });
            // @ts-ignore
            return await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    invoices: {
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
                                invoiceNumber,
                                state: StateEnum[1]
                            }
                        }
                    }
                }
            })
        } catch (e) {
            throw new ErrorHandling("INVOICE003", e.message)
        }
    },


    /**
     * Change invoice state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     */
    changeInvoiceState: async (_, args, context: Context) => {
        try {
            await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    invoices: {
                        update: {
                            where: {id: args.id},
                            data: {state: StateEnum[args.state]}
                        }
                    }
                }
            });
            return context.prisma.invoice({id: args.id})
        } catch (e) {
            throw new ErrorHandling("INVOICE003", e.message)
        }
    },
    /**
     * Delete invoice by id for current user only if state != DRAFT
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteInvoice: async (_, args, context: Context) => {
        try {
            const invoiceState = await context.prisma.invoice({id: args.id}).$fragment(fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== StateEnum["0"]) throw new Error("Vous ne pouvez pas supprimer une facture déjà validé. ");
            await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    invoices: {
                        delete: {id: args.id}
                    }
                }
            });
            return true
        } catch (e) {
            throw new ErrorHandling("INVOICE004", e.message)
        }
    },
};