import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {Context, sendConfirmationMail} from '../../utils'
import * as fs from 'fs'

const privateKey = fs.readFileSync('./private_key.pem');

export const authMutation = {
    captureEmail: async (_, args, context: Context) => {
        const isEmailTaken = await context.prisma.user({email: args.email});

        if (isEmailTaken) throw new Error("L'email est déjà utilisé.");
        const user = await context.prisma.createUser({
            email: args.email,
            role: "USER",
            status: "NOTACTIVE"
        });
        await sendConfirmationMail(args.email, user.id)
    },
    signup: async (_, args, context: Context) => {
        const password = await bcrypt.hash(args.password, 10);
        const id = args.id
        delete args.id
        const user = await context.prisma.updateUser({
            data: {
                ...args,
                password,
                role: "USER",
                status: "ACTIVE"
            }, where: {id: id}
        });
        const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRATION
        });
        return {token, user}
    },
    login: async(_, args, context: Context) => {
        const user = await context.prisma.user({email: args.email});
        if (!user) throw new Error('No such user found');
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) throw new Error('Invalid password');
        const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRATION
        });
        return {token, user}
    },
};