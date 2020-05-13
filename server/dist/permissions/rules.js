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
const graphql_shield_1 = require("graphql-shield");
const utils_1 = require("../utils");
exports.isAdmin = graphql_shield_1.rule()((parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = yield utils_1.getAuth(context);
    const user = yield context.prisma.$exists.user({ id });
    if (!user)
        return new Error("L'utilisateur n'existe pas.");
    if (role !== "ADMIN")
        return new Error("Vous n'êtes pas administrateur.");
    return true;
}));
exports.isUser = graphql_shield_1.rule()((parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = yield utils_1.getAuth(context);
    const user = yield context.prisma.$exists.user({ id });
    if (!user)
        return new Error("L'utilisateur n'existe pas.");
    return true;
}));
exports.isAuthenticated = graphql_shield_1.or(exports.isAdmin, exports.isUser);
