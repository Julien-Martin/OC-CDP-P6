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
exports.clientMutation = {
    /**
     * Create client for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createClient: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const legalFormId = args.legalForm;
        delete args.legalForm;
        try {
            return yield context.prisma.createClient(Object.assign(Object.assign({}, args), { legalForm: {
                    connect: {
                        id: legalFormId
                    }
                }, user: {
                    connect: {
                        id: context.user.id
                    }
                } }));
        }
        catch (e) {
            throw new errors_1.ErrorHandling("CLIENT001", e.message);
        }
    }),
    /**
     * Update client by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    updateClient: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const id = args.id;
        const legalFormId = args.legalForm;
        delete args.legalForm;
        delete args.id;
        try {
            yield context.prisma.updateClient({
                where: { id: id },
                data: Object.assign(Object.assign({}, args), { legalForm: {
                        connect: {
                            id: legalFormId
                        }
                    } })
            });
            return yield context.prisma.client({ id: id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("CLIENT002", e.message);
        }
    }),
    /**
     * Delete client by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteClient: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let estimateCounter = (yield context.prisma.client({ id: args.id }).estimates()).length;
            let invoiceCounter = (yield context.prisma.client({ id: args.id }).invoices()).length;
            if (estimateCounter)
                throw ("Ce client a des devis associés.");
            if (invoiceCounter)
                throw ("Ce client a des factures associés.");
            yield context.prisma.updateUser({
                where: { id: context.user.id },
                data: {
                    clients: {
                        delete: { id: args.id }
                    }
                }
            });
            return true;
        }
        catch (e) {
            throw new errors_1.ErrorHandling("CLIENT003", e);
        }
    }),
};
