import * as jwt from 'jsonwebtoken'
import {Prisma} from '../generated'
import * as fs from 'fs'
import * as nodemailer from "nodemailer";
import {welcomeEmail} from "./emails";
import {ErrorHandling} from "./errors";

import * as dotenv from "dotenv"
dotenv.config()

const publicKey = fs.readFileSync('./public_key.pem');


export interface Context {
    prisma: Prisma
    request: any
}

export const StateEnum = {
    0: "DRAFT",
    1: "PENDING",
    2: "SEND",
    3: "DONE"
}

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
})

export const sendConfirmationMail = async (email, id) => {
    await transporter.sendMail(welcomeEmail(email, id));
}

export const isAuth = async (context: Context) => {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        try {
            const token = Authorization.replace('Bearer ', '');
            const {id} = jwt.verify(token, publicKey);
            const user = await context.prisma.$exists.user({id: id})
            if (user) throw new ErrorHandling("AUTH-003")
            return id
        } catch (e) {
            throw new ErrorHandling(e)
        }
    } else {
        throw new ErrorHandling("AUTH-002")
    }
}

export const isAdmin = async (context: Context) => {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        try {
            const {id, role} = jwt.verify(token, publicKey);
            const user = await context.prisma.$exists.user({id})
            if (!user) throw new Error("L'utilisateur n'existe pas")
            else {
                if (role !== "ADMIN") console.log('not admin')
                return id
            }
        } catch (e) {
            console.log(e)
        }
    }
}