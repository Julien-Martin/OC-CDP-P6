import * as bcrypt from 'bcrypt'
import {Context} from '../../utils'
import {ErrorHandling} from "../../utils/errors";

export const userMutation = {
    /**
     * Update personnal info
     * @param _
     * @param args
     * @param context
     */
    async updateMe(_, args, context: Context) {
        let name = args.name;
        let address = args.address;
        delete args.name;
        delete args.address;
        try {
            return await context.prisma.updateUser({
                where: {id: context.user.id},
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

    /**
     * Change password, required old password
     * @param _
     * @param args
     * @param context
     */
    async updatePassword(_, args, context: Context) {
        try {
            const user = await context.prisma.user({id: context.user.id});
            const validPassword = await bcrypt.compare(args.oldpassword, user.password);
            let password = await bcrypt.hash(args.password, 10);
            if (!validPassword) throw ("Mot de passe invalide");
            await context.prisma.updateUser({
                where: {id: context.user.id},
                data: {
                    password: password
                }
            });
            return true
        } catch (e) {
            throw new ErrorHandling("ME002", e.message)
        }
    },

    /**
     * Delete account, required password
     * @param _
     * @param args
     * @param context
     */
    async deleteMe(_, args, context: Context) {
        const user = await context.prisma.user({id: context.user.id});
        const validPassword = await bcrypt.compare(args.password, user.password);
        if (!validPassword) throw new Error('Mot de passe invalide.');
        try {
            await context.prisma.deleteUser({id: context.user.id});
            return true
        } catch (e) {
            throw new ErrorHandling("ME003", e.message)
        }
    },
};