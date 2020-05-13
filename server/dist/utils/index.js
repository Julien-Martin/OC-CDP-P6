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
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const emails_1 = require("./emails");
const errors_1 = require("./errors");
const dotenv = require("dotenv");
dotenv.config();
const publicKey = fs.readFileSync('./public_key.pem');
/**
 * Enum for document's state
 */
exports.StateEnum = {
    0: "DRAFT",
    1: "PENDING",
    2: "SEND",
    3: "DONE"
};
/**
 * Transporter to send mail
 */
exports.transporter = nodemailer.createTransport({
    host: 'SSL0.OVH.NET',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});
/**
 * Function that send confirmation mail
 * @param email
 * @param id
 */
exports.sendConfirmationMail = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.transporter.sendMail(emails_1.welcomeEmail(email, id));
});
/**
 * Function that send forgot password mail
 * @param email
 * @param id
 */
exports.sendForgotPasswordMail = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.transporter.sendMail(emails_1.forgotPasswordEmail(email, id));
});
exports.getAuth = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const Authorization = yield context.request.get('Authorization');
    if (Authorization) {
        try {
            const token = Authorization.replace('Bearer ', '');
            const { id, role } = yield jwt.verify(token, publicKey);
            const user = yield context.prisma.$exists.user({ id });
            if (!user)
                throw "USER001";
            context.user = { id, role };
            return { id, role };
        }
        catch (e) {
            throw new errors_1.ErrorHandling(e);
        }
    }
    else {
        return null;
    }
});
