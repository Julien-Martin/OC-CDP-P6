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
const fragments_1 = require("../../utils/fragments");
const moment = require("moment");
const errors_1 = require("../../utils/errors");
exports.estimateMutation = {
    /**
     * Create estimate with static client user and products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createEstimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
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
            args.startedDate = new Date(args.startedDate).toISOString();
            args.deliveryDate = new Date(args.deliveryDate).toISOString();
            args.validityDate = new Date(args.deliveryDate).toISOString();
            return yield context.prisma.createEstimate(Object.assign(Object.assign({}, args), { state: "DRAFT", userId: context.user.id, user: {
                    connect: { id: context.user.id }
                }, client: {
                    connect: { id: clientId }
                }, products: {
                    create: products
                }, price }));
        }
        catch (e) {
            throw new errors_1.ErrorHandling("ESTIMATE001", e.message);
        }
    }),
    /**
     * Update estimate by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    updateEstimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = args.id;
            delete args.id;
            const estimateState = yield context.prisma.estimate({ id: id }).$fragment(fragments_1.fragment.fragmentEstimateState);
            if (estimateState['state'] !== utils_1.StateEnum["0"])
                throw ("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let products = args.products;
            let price = 0;
            if (args.products) {
                products.forEach(item => {
                    item.productId = item.product.id;
                    item.quantity = parseInt(item.quantity);
                    delete item.product;
                });
                yield context.prisma.updateEstimate({
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
            args.startedDate = new Date(args.startedDate).toISOString();
            args.deliveryDate = new Date(args.deliveryDate).toISOString();
            args.validityDate = new Date(args.deliveryDate).toISOString();
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    estimates: {
                        update: {
                            where: { id },
                            data: Object.assign(Object.assign({}, args), { price, products: {
                                    create: products
                                } })
                        }
                    }
                }
            });
            return yield context.prisma.estimate({ id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("ESTIMATE002", e.message);
        }
    }),
    /**
     * Change estimate state to "PENDING" and copy User, Client and Product info to StaticUser, StaticClient and StaticProducts
     * An estimate with state different of "DRAFT" cannot be change
     * @param _
     * @param args
     * @param context
     */
    validateEstimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const estimateState = yield context.prisma.estimate({ id: args.id }).$fragment(fragments_1.fragment.fragmentEstimateState);
            if (estimateState['state'] !== utils_1.StateEnum["0"])
                throw ("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ");
            let client = yield context.prisma.estimate({ id: args.id }).client();
            let staticUser = yield context.prisma.estimate({ id: args.id }).user().$fragment(fragments_1.fragment.fragmentUser);
            let staticClient = yield context.prisma.estimate({ id: args.id }).client().$fragment(fragments_1.fragment.fragmentClient);
            let staticProducts = yield context.prisma.estimate({ id: args.id }).products().$fragment(fragments_1.fragment.fragmentEnsureProduct);
            const estimateCounter = yield context.prisma.estimatesConnection({ where: { estimateNumber_gt: "" } }).aggregate().count();
            const estimateNumber = moment().format('YYYY-MM-') + ("000" + (estimateCounter + 1)).slice(-4);
            yield context.prisma.updateClient({
                where: { id: client.id },
                data: {
                    estimates: {
                        disconnect: [{ id: args.id }]
                    }
                }
            });
            console.log(typeof staticProducts);
            // @ts-ignore
            return yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    estimates: {
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
                                estimateNumber,
                                // @ts-ignore
                                state: utils_1.StateEnum[1]
                            }
                        }
                    }
                }
            });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("ESTIMATE003", e.message);
        }
    }),
    /**
     * Change estimate state to PENDING, SEND or DONE
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    changeEstimateState: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    estimates: {
                        update: {
                            where: { id: args.id },
                            data: {
                                state: utils_1.StateEnum[args.state]
                            }
                        }
                    }
                }
            });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("ESTIMATE003", e.message);
        }
    }),
    /**
     * Delete estimate by id for current user only if state != DRAFT
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteEstimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const estimateState = yield context.prisma.estimate({ id: args.id }).$fragment(fragments_1.fragment.fragmentEstimateState);
            if (estimateState['state'] !== utils_1.StateEnum["0"])
                throw ("Vous ne pouvez pas supprimer un devis déjà validé. ");
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    estimates: {
                        delete: { id: args.id }
                    }
                }
            });
            return true;
        }
        catch (e) {
            throw new errors_1.ErrorHandling("ESTIMATE004", e.message);
        }
    }),
};
