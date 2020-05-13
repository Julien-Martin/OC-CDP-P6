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
const jwt = require("jsonwebtoken");
const utils_1 = require("../../utils");
const fs = require("fs");
const errors_1 = require("../../utils/errors");
const privateKey = fs.readFileSync('./private_key.pem');
exports.authMutation = {
    /**
     * Capture email and send confirmation email
     * @param _
     * @param args
     * @param context
     */
    captureEmail: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const isEmailTaken = yield context.prisma.user({ email: args.email });
        if (isEmailTaken)
            throw new Error("L'email est déjà utilisé.");
        const user = yield context.prisma.createUser({
            email: args.email,
            role: "USER",
            status: "NOTACTIVE"
        });
        if (user) {
            yield utils_1.sendConfirmationMail(args.email, user.id);
        }
    }),
    /**
     * Update user with the new information and hash the password
     * @param _
     * @param args
     * @param context
     */
    signup: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const password = yield bcrypt.hash(args.password, 10);
        const id = args.id;
        delete args.id;
        const user = yield context.prisma.updateUser({
            data: Object.assign(Object.assign({}, args), { password, role: "USER", status: "ACTIVE" }), where: { id: id }
        });
        const token = jwt.sign({ id: user.id, role: user.role }, privateKey, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRATION
        });
        return { token, user };
    }),
    /**
     * Login Function return token, and user info
     * @param _
     * @param args
     * @param context
     */
    login: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield context.prisma.user({ email: args.email });
        if (!user)
            throw new errors_1.ErrorHandling("USER001");
        const valid = yield bcrypt.compare(args.password, user.password);
        if (!valid)
            throw new errors_1.ErrorHandling("AUTH001");
        const token = jwt.sign({ id: user.id, role: user.role }, privateKey, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRATION
        });
        return { token, user };
    }),
    /**
     * Forgot password
     * @param _
     * @param args
     * @param context
     */
    forgotPassword: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield context.prisma.user({ email: args.email });
        if (!user)
            throw new errors_1.ErrorHandling("FORGOT001");
        yield utils_1.sendForgotPasswordMail(args.email, user.id);
        return true;
    }),
    forgotPasswordChange: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield context.prisma.user({ id: args.id });
            if (!user)
                throw ("Impossible de changer le mot de passe.");
            let password = yield bcrypt.hash(args.password, 10);
            yield context.prisma.updateUser({
                where: { id: args.id },
                data: { password }
            });
            return true;
        }
        catch (e) {
            throw new errors_1.ErrorHandling("FORGOT002", e.message);
        }
    })
};
