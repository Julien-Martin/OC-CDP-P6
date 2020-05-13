"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const moment = require("moment");
const fragments_1 = require("../../utils/fragments");
const errors_1 = require("../../utils/errors");
exports.invoiceMutation = {
    /**
     * Create invoice with static client user and products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createInvoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clientId = args.clientId;
            delete args.clientId;
            const client = yield context.prisma.client({ id: clientId }).$fragment(fragments_1.fragment.fragmentClient);
            if (!client)
                throw new Error("Client introuvable.");
            let products = args.products;
            args.products.forEach(item => {
                item.productId = item.product.id;
                item.quantity = parseInt(item.quantity);
                delete item.product;
            });
            let price = 0;
            for (let i = 0; i < products.length; i++) {
                let productPrice = (yield context.prisma.product({ id: products[i].productId }).$fragment(fragments_1.fragment.fragmentProductOnlyPrice))["pricettc"];
                products[i].product = { connect: { id: products[i].productId } };
                delete products[i].productId;
                price += productPrice * products[i].quantity;
            }
            delete args.products;
            let deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
            args.billingDate = new Date(args.billingDate).toISOString();
            args.deadline = new Date(deadline.toString()).toISOString();
            return yield context.prisma.createInvoice(Object.assign(Object.assign({}, args), { state: "DRAFT", userId: context.user.id, user: {
                    connect: { id: context.user.id }
                }, client: {
                    connect: { id: clientId }
                }, products: {
                    create: products
                }, price }));
        }
        catch (e) {
            throw new errors_1.ErrorHandling("INVOICE001", e.message);
        }
    }),
    /**
     * Update invoice by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean>}
     */
    updateInvoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let id = args.id;
            delete args.id;
            let invoiceState = yield context.prisma.invoice({ id: id }).$fragment(fragments_1.fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== utils_1.StateEnum["0"])
                throw ("Cette facture a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let products = args.products;
            let price = 0;
            if (args.products) {
                products.forEach(item => {
                    item.productId = item.product.id;
                    item.quantity = parseInt(item.quantity);
                    delete item.product;
                });
                yield context.prisma.updateInvoice({
                    where: { id: id },
                    data: { products: { deleteMany: { quantity_not: 0 } } }
                });
                for (let i = 0; i < products.length; i++) {
                    let productPrice = (yield context.prisma.product({ id: products[i].productId }).$fragment(fragments_1.fragment.fragmentProductOnlyPrice))["pricettc"];
                    products[i].product = { connect: { id: products[i].productId } };
                    delete products[i].productId;
                    price += productPrice * products[i].quantity;
                }
                delete args.products;
            }
            let deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
            args.billingDate = new Date(args.billingDate).toISOString();
            args.deadline = new Date(deadline.toString()).toISOString();
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    invoices: {
                        update: {
                            where: { id },
                            data: Object.assign(Object.assign({}, args), { price, products: {
                                    create: products
                                } })
                        }
                    }
                }
            });
            return yield context.prisma.invoice({ id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("INVOICE002", e.message);
        }
    }),
    /**
     * Change invoice state to "PENDING" and copy User, Client and Product info to StaticUser, StaticClient and StaticProducts
     * An invoice with state different of "DRAFT" cannot be change
     * @param _
     * @param args
     * @param context
     */
    validateInvoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const invoiceState = yield context.prisma.invoice({ id: args.id }).$fragment(fragments_1.fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== utils_1.StateEnum["0"])
                throw ("Cette facture a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let client = yield context.prisma.invoice({ id: args.id }).client();
            let staticUser = yield context.prisma.invoice({ id: args.id }).user().$fragment(fragments_1.fragment.fragmentUser);
            let staticClient = yield context.prisma.invoice({ id: args.id }).client().$fragment(fragments_1.fragment.fragmentClient);
            let staticProducts = yield context.prisma.invoice({ id: args.id }).products().$fragment(fragments_1.fragment.fragmentEnsureProduct);
            const invoiceCounter = yield context.prisma.invoicesConnection({ where: { invoiceNumber_gt: "" } }).aggregate().count();
            const invoiceNumber = moment().format('YYYY-MM-') + ("000" + (invoiceCounter + 1)).slice(-4);
            yield context.prisma.updateClient({
                where: { id: client.id },
                data: {
                    invoices: {
                        disconnect: [{ id: args.id }]
                    }
                }
            });
            // @ts-ignore
            return yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    invoices: {
                        // @ts-ignore
                        update: {
                            where: { id: args.id },
                            data: {
                                products: {
                                    deleteMany: {
                                        quantity_not: -1
                                    }
                                },
                                staticUser,
                                staticClient,
                                staticProducts: {
                                    // @ts-ignore
                                    create: staticProducts
                                },
                                invoiceNumber,
                                // @ts-ignore
                                state: utils_1.StateEnum[1]
                            }
                        }
                    }
                }
            });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("INVOICE003", e.message);
        }
    }),
    /**
     * Change invoice state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     */
    changeInvoiceState: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    invoices: {
                        update: {
                            where: { id: args.id },
                            data: { state: utils_1.StateEnum[args.state] }
                        }
                    }
                }
            });
            return context.prisma.invoice({ id: args.id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("INVOICE003", e.message);
        }
    }),
    /**
     * Delete invoice by id for current user only if state != DRAFT
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteInvoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const invoiceState = yield context.prisma.invoice({ id: args.id }).$fragment(fragments_1.fragment.fragmentInvoiceState);
            if (invoiceState['state'] !== utils_1.StateEnum["0"])
                throw new Error("Vous ne pouvez pas supprimer une facture déjà validé. ");
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    invoices: {
                        delete: { id: args.id }
                    }
                }
            });
            return true;
        }
        catch (e) {
            throw new errors_1.ErrorHandling("INVOICE004", e.message);
        }
    }),
};
