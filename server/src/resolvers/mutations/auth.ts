import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {Context, sendConfirmationMail, sendForgotPasswordMail} from '../../utils'
import * as fs from 'fs'
import {ErrorHandling} from "../../utils/errors";

const privateKey = fs.readFileSync('./private_key.pem');

export const authMutation = {
    /**
     * Capture email and send confirmation email
     * @param _
     * @param args
     * @param context
     */
    captureEmail: async (_, args, context: Context) => {
        const isEmailTaken = await context.prisma.user({email: args.email});

        if (isEmailTaken) throw new Error("L'email est déjà utilisé.");
        const user = await context.prisma.createUser({
            email: args.email,
            role: "USER",
            status: "NOTACTIVE"
        });
        if (user) {
            await sendConfirmationMail(args.email, user.id)
        }
    },

    /**
     * Update user with the new information and hash the password
     * @param _
     * @param args
     * @param context
     */
    signup: async (_, args, context: Context) => {
        const password = await bcrypt.hash(args.password, 10);
        const id = args.id;
        delete args.id;
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
    /**
     * Login Function return token, and user info
     * @param _
     * @param args
     * @param context
     */
    login: async (_, args, context: Context) => {
        const user = await context.prisma.user({email: args.email});
        if (!user) throw new ErrorHandling("USER001");
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) throw new ErrorHandling("AUTH001");
        const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: process.env.JWT_EXPIRATION
        });
        return {token, user}
    },
    /**
     * Forgot password
     * @param _
     * @param args
     * @param context
     */
    forgotPassword: async (_, args, context: Context) => {
        const user = await context.prisma.user({email: args.email});
        if (!user) throw new ErrorHandling("FORGOT001");
        await sendForgotPasswordMail(args.email, user.id);
        return true
    },

    forgotPasswordChange: async (_, args, context: Context) => {
        try {
            let user = await context.prisma.user({id: args.id});
            if(!user) throw ("Impossible de changer le mot de passe.");
            let password = await bcrypt.hash(args.password, 10);
            await context.prisma.updateUser({
                where: {id: args.id},
                data: {password}
            });
            return true
        } catch (e) {
            throw new ErrorHandling("FORGOT002", e.message)
        }
    }
};