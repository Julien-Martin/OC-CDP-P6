import * as jwt from 'jsonwebtoken'
import {Prisma} from '../generated'
import * as fs from 'fs'
import * as nodemailer from "nodemailer";
import {welcomeEmail} from "./emails";
import {ErrorHandling} from "./errors";

import * as dotenv from "dotenv"
dotenv.config();

const publicKey = fs.readFileSync('./public_key.pem');

/**
 * Define Context type (typeScript)
 */
export interface Context {
    prisma: Prisma
    request: any
}

/**
 * Enum for document's state
 */
export const StateEnum = {
    0: "DRAFT",
    1: "PENDING",
    2: "SEND",
    3: "DONE"
};

/**
 * Transporter to send mail
 */
export const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
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
export const sendConfirmationMail = async (email, id) => {
    await transporter.sendMail(welcomeEmail(email, id));
};


/**
 * Return id of authenticated's user
 * @param context
 */
export const isAuth = async (context: Context) => {
    const {id} = await checkAuth(context);
    return id
};

/**
 * Check if user is Admin
 * @param context
 */
export const isAdmin = async (context: Context) => {
    try {
        const {id, role} = await checkAuth(context);
        if(role !== "ADMIN") throw "AUTH003";
        return id
    } catch (e) {
        throw new ErrorHandling(e)
    }
};

/**
 * Check if user is Authenticated
 * @param context
 */
const checkAuth = async (context: Context) => {
    const Authorization = context.request.get('Authorization');
    if(Authorization){
        try {
            const token = Authorization.replace('Bearer ', '');
            const {id, role} = jwt.verify(token, publicKey);
            const user = await context.prisma.$exists.user({id});
            if(!user) throw "USER001";
            return {id, role}
        } catch (e) {
            throw new ErrorHandling(e)
        }
    } else throw new ErrorHandling("AUTH002")
};