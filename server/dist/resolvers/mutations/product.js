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
const errors_1 = require("../../utils/errors");
exports.productMutation = {
    /**
     * Create product for current user
     * @param _
     * @param args
     * @param context
     */
    createProduct: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const priceht = Math.round((args.pricettc / (1 + args.vat / 100)) * 100) / 100;
            return yield context.prisma.createProduct(Object.assign(Object.assign({}, args), { priceht: priceht, user: {
                    connect: {
                        id: context.user.id
                    }
                } }));
        }
        catch (e) {
            throw new errors_1.ErrorHandling("PRODUCT001", e.message);
        }
    }),
    /**
     * Update product by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    updateProduct: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const id = args.id;
        delete args.id;
        try {
            const priceht = args.pricettc / (1 + args.vat / 100);
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    products: {
                        update: {
                            where: { id: id },
                            data: Object.assign(Object.assign({}, args), { priceht: priceht })
                        }
                    }
                }
            });
            return yield context.prisma.product({ id: id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("PRODUCT002", e.message);
        }
    }),
    /**
     * Delete product by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteProduct: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let estimateCounter = (yield context.prisma.estimates({ where: { products_some: { product: { id: args.id } } } })).length;
            let invoiceCounter = (yield context.prisma.invoices({ where: { products_some: { product: { id: args.id } } } })).length;
            if (estimateCounter)
                throw ("Ce produit est associé a des devis.");
            if (invoiceCounter)
                throw ("Ce produit est associé a une facture.");
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    products: {
                        delete: {
                            id: args.id
                        }
                    }
                }
            });
            return true;
        }
        catch (e) {
            throw new errors_1.ErrorHandling("PRODUCT003", e);
        }
    }),
};
