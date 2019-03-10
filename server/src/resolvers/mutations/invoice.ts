import {Context, isAuth, StateEnum} from "../../utils";
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
            const userId = await isAuth(context);
            const clientId = args.clientId;
            delete args.clientId;
            const user = await context.prisma.user({id: userId}).$fragment(fragment.fragmentUser);
            if(!user) throw new Error("Utilisateur introuvable.");
            const client = await context.prisma.client({id: clientId}).$fragment(fragment.fragmentClient);
            if(!client) throw new Error("Client introuvable.");
            const products = args.products;
            let price = 0;
            for (let i = 0; i < products.length; i++) {
                products[i].product = await context.prisma.product({id: products[i].product}).$fragment(fragment.fragmentProduct);
                price += products[i].product.pricettc * products[i].quantity
            }
            const invoiceCounter = await context.prisma.invoicesConnection({where: {id: userId}}).aggregate().count();
            const invoiceNumber = moment().format('YYYY-MM-') + (invoiceCounter + 1);
            const deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
            const invoice = await context.prisma.createInvoice({
                ...args,
                userId,
                state: StateEnum["0"],
                user,
                client,
                price,
                deadline,
                invoiceNumber,
                products: {
                    create: products
                }
            });
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    invoices: {
                        connect: {id: invoice.id}
                    }
                }
            });
            await context.prisma.updateClient({
                where: {id: clientId},
                data: {
                    invoices: {
                        connect: {id: invoice.id}
                    }
                }
            });
            return invoice
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
        const userId = await isAuth(context);
        const id = args.id;
        delete args.id;
        if (args.products) {
            for (let i = 0; i < args.products.length; i++) {
                args.products[i].product = await context.prisma.product({id: args.products[i].product}).$fragment(fragment.fragmentProduct);
                args.price += args.products[i].product.pricettc * args.products[i].quantity
            }
        }
        args.deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
        try {
            const invoiceState = await context.prisma.invoice({id: id}).$fragment(fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== StateEnum["0"]) throw new Error("Cette facture a déjà été validé. , vous ne pouvez donc pas la modifier.");

            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    invoices: {
                        update: {
                            where: {id: id},
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
            return await context.prisma.invoice({id: id})
        } catch (e) {
            throw new ErrorHandling("INVOICE002", e.message)
        }
    },
    /**
     * Change invoice state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     */
    changeInvoiceState: async (_, args, context: Context) => {
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
        const userId = await isAuth(context);
        try {
            const invoiceState = await context.prisma.estimate({id: args.id}).$fragment(fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== StateEnum["0"]) throw new Error("Vous ne pouvez pas supprimer une facture déjà validé. ");
            await context.prisma.updateUser({
                where: {id: userId},
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