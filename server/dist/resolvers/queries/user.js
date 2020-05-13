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
exports.userQuery = {
    /**
     * Get current user profile
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    me: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id });
    }),
    /**
     * Get current user products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meProducts: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).products();
    }),
    meProduct: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).products({ where: { id: args.id } });
    }),
    /**
     * Get current user clients
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClients: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).clients();
    }),
    /**
     * Get one product by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meClient: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).clients({ where: { id: args.id } });
    }),
    /**
     * Get current user invoices
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoices: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).invoices();
    }),
    /**
     * Get one invoice by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meInvoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).invoices({ where: { id: args.id } });
    }),
    /**
     * Get current user's estimates
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    meEstimates: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).estimates();
    }),
    /**
     * Get one estimate by ID and only from current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean|StorageEstimate|StorageEstimate>}
     */
    meEstimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: context.user.id }).estimates({ where: { id: args.id } });
    }),
};
