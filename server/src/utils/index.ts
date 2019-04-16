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
    user: { role; id };
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
export const sendConfirmationMail = async (email, id) => {
    await transporter.sendMail(welcomeEmail(email, id));
};

export const getAuth = async (context: Context) => {
    const Authorization = await context.request.get('Authorization')
    if(Authorization){
        try {
            const token = Authorization.replace('Bearer ', '')
            const {id, role} = await jwt.verify(token, publicKey)
            const user = await context.prisma.$exists.user({id})
            if(!user) return null
            context.user = {id, role}
            return {id, role}
        }catch (e) {
            throw new ErrorHandling('AUTH001', e.message)
        }
    } else {
        return null
    }
}