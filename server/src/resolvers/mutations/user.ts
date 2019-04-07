import * as bcrypt from 'bcrypt'
import {Context, isAuth} from '../../utils'
import {ErrorHandling} from "../../utils/errors";

export const userMutation = {
    async updateMe(_, args, context: Context) {
        const userId = await isAuth(context);
        let name = args.name
        let address = args.address
        delete args.name
        delete args.address
        try {
            return await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    ...args,
                    name: {create: {firstname: name.firstname, lastname: name.lastname}},
                    address: {
                        create: {
                            street: address.street,
                            street2: address.street2,
                            city: address.city,
                            country: address.country,
                            postalcode: address.postalcode
                        }
                    }
                }
            })
        } catch (e) {
            throw new ErrorHandling("ME002", e.message)
        }
    },

    async updatePassword(_, args, context: Context) {
        const userId = await isAuth(context)
        try {
            const user = await context.prisma.user({id: userId})
            const validPassword = await bcrypt.compare(args.oldpassword, user.password)
            let password = await bcrypt.hash(args.password, 10);
            if (!validPassword) throw ("Mot de passe invalide")
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    password: password
                }
            })
            return true
        } catch (e) {
            throw new ErrorHandling("ME002", e.message)
        }
    },

    async deleteMe(_, args, context: Context) {
        const userId = await isAuth(context);
        const user = await context.prisma.user({id: userId});
        const validPassword = await bcrypt.compare(args.password, user.password);
        if (!validPassword) throw new Error('Mot de passe invalide.');
        try {
            await context.prisma.deleteUser({id: userId});
            return true
        } catch (e) {
            throw new ErrorHandling("ME003", e.message)
        }
    },
};