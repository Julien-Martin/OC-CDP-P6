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
exports.Estimate = {
    /**
     * Return User info in Estimate Query
     * @param _
     * @param args
     * @param context
     */
    user: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.estimate({ id: _.id }).user();
    }),
    /**
     * Return Client info in Estimate Query
     * @param _
     * @param args
     * @param context
     */
    client: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        return context.prisma.estimate({ id: _.id }).client();
    }),
    /**
     * Return Product info in Estimate Query
     * @param _
     * @param args
     * @param context
     * @param info
     */
    products: (_, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        return yield context.prisma.estimate({ id: _.id }).products().$fragment(`
            fragment EnsureProduct on Estimate {
                product {
                    id
                    description 
                    priceht 
                    pricettc 
                    vat 
                    unit
                }
                quantity
            }
        `);
    })
};
