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
exports.adminQuery = {
    /**
     * Get all users
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    users: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.users();
    }),
    /**
     * Get one user by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    user: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: args.id });
    }),
    /**
     * Get all products
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    products: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.products();
    }),
    /**
     * Get one product by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    product: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.product({ id: args.id });
    }),
    /**
     * Get all clients
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    clients: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.clients();
    }),
    /**
     * Get one client by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    client: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.product({ id: args.id });
    }),
    /**
     * Get all Legal Form
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    legalForms: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.legalForms();
    }),
    /**
     * Get one Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    legalForm: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.legalForm({ id: args.id });
    }),
    /**
     * Get all Invoices
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoices: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.invoices();
    }),
    /**
     * Get one Invoice by ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoice: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.invoice({ id: args.id });
    }),
    /**
     * Get all invoices by User ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoicesByUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: args.id }).invoices();
    }),
    /**
     * Get all estimates
     * @param _
     * @param args
     * @param context
     */
    estimates: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.estimates();
    }),
    /**
     * Get one estimates by ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|boolean|StorageEstimate>}
     */
    estimate: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.estimate({ id: args.id });
    }),
    /**
     * Get all estimates by User ID
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    estimatesByUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.user({ id: args.id }).estimates();
    }),
};
