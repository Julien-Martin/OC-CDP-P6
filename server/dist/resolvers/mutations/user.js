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
const bcrypt = require("bcrypt");
const errors_1 = require("../../utils/errors");
exports.userMutation = {
    /**
     * Update personnal info
     * @param _
     * @param args
     * @param context
     */
    updateMe(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = args.name;
            let address = args.address;
            delete args.name;
            delete args.address;
            try {
                return yield context.prisma.updateUser({
                    where: { id: context.user.id },
                    data: Object.assign(Object.assign({}, args), { name: { create: { firstname: name.firstname, lastname: name.lastname } }, address: {
                            create: {
                                street: address.street,
                                street2: address.street2,
                                city: address.city,
                                country: address.country,
                                postalcode: address.postalcode
                            }
                        } })
                });
            }
            catch (e) {
                throw new errors_1.ErrorHandling("ME002", e.message);
            }
        });
    },
    /**
     * Change password, required old password
     * @param _
     * @param args
     * @param context
     */
    updatePassword(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield context.prisma.user({ id: context.user.id });
                const validPassword = yield bcrypt.compare(args.oldpassword, user.password);
                let password = yield bcrypt.hash(args.password, 10);
                if (!validPassword)
                    throw ("Mot de passe invalide");
                yield context.prisma.updateUser({
                    where: { id: context.user.id },
                    data: {
                        password: password
                    }
                });
                return true;
            }
            catch (e) {
                throw new errors_1.ErrorHandling("ME002", e.message);
            }
        });
    },
    /**
     * Delete account, required password
     * @param _
     * @param args
     * @param context
     */
    deleteMe(_, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield context.prisma.user({ id: context.user.id });
            const validPassword = yield bcrypt.compare(args.password, user.password);
            if (!validPassword)
                throw new Error('Mot de passe invalide.');
            try {
                yield context.prisma.deleteUser({ id: context.user.id });
                return true;
            }
            catch (e) {
                throw new errors_1.ErrorHandling("ME003", e.message);
            }
        });
    },
};
