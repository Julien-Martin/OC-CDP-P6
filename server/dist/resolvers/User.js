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
exports.User = {
    /**
     * Return products in User Query
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|Promise<*>>}
     */
    products: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.user({ id: _.id }).products();
    }),
    /**
     * Return clients in User Query
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    clients: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.user({ id: _.id }).clients();
    }),
    /**
     * Return invoices in User Query
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    invoices: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.user({ id: _.id }).invoices();
    }),
    /**
     * Return estimates in User Query
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    estimates: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.user({ id: _.id }).estimates();
    })
};
