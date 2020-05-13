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
exports.adminMutation = {
    /**
     * Delete user by id or email
     * @param _
     * @param args
     * @param context
     */
    deleteUser(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield context.prisma.deleteUser({ id: args.id });
                return !!deleted;
            }
            catch (e) {
            }
        });
    },
    /**
     * Update user by id or email
     * @param _
     * @param args
     * @param context
     */
    updateUser(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = args.id;
                delete args.id;
                return yield context.prisma.updateUser({
                    where: { id },
                    data: Object.assign({}, args)
                });
            }
            catch (e) {
                throw new errors_1.ErrorHandling("ME002", e.message);
            }
        });
    }
};
