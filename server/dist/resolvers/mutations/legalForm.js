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
exports.legalFormMutation = {
    /**
     * Create Legal Form
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    createLegalForm: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield context.prisma.createLegalForm(Object.assign({}, args));
        }
        catch (e) {
            throw new errors_1.ErrorHandling("LEGALFORM001", e.message);
        }
    }),
    /**
     * Update Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    updateLegalForm: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const id = args.id;
        delete args.id;
        try {
            return yield context.prisma.updateLegalForm({
                where: { id: id },
                data: args
            });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("LEGALFORM002", e.message);
        }
    }),
    /**
     * Delete Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    deleteLegalForm: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield context.prisma.deleteLegalForm({ id: args.id });
        }
        catch (e) {
            throw new errors_1.ErrorHandling("LEGALFORM003", e.message);
        }
    }),
};
