import * as jwt from 'jsonwebtoken'
import {Prisma} from './generated'
import * as fs from 'fs'
import * as nodemailer from "nodemailer";

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

const pass = process.env.MAILER_PASSWORD
const user = process.env.MAILER_EMAIL

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: user,
        pass: pass
    }
})

export const isAuth = async (context: Context) => {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        try {
            const {id} = jwt.verify(token, publicKey);
            const user = await context.prisma.$exists.user({id: id})
            if (!user) throw new Error("L'utilisateur n'existe pas.")
            return id
        } catch (e) {
            throw new AuthError('Le token est invalide. ' + e)
        }
    }
    throw new AuthError("L'authentification a échoué")
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
                if (role !== "ADMIN") throw new AuthError("Vous n'êtes pas administrateur");
                return id
            }
        } catch (e) {
            throw new AuthError("L'authentification a échoué. " + e)
        }
    }
}

export class AuthError extends Error {
    constructor(prop) {
        super(prop);
    }
}