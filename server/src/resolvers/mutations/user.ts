import * as bcrypt from 'bcrypt'
import {Context, isAuth} from '../../utils'

export const userMutation = {
    async updateMe(_, args, context: Context) {
        const userId = await isAuth(context)
        return await context.prisma.updateUser({
            where: {id: userId},
            data: {
                ...args,
            }
        })
    },

    async deleteMe(_, args, context: Context) {
        const userId = await isAuth(context)
        const user = await context.prisma.user({id: userId})
        const validPassword = await bcrypt.compare(args.password, user.password)
        if (!validPassword) throw new Error('Mot de passe invalide.')
        try {
            await context.prisma.deleteUser({id: userId})
            return true
        } catch (e) {
            throw new Error("Impossible de supprimer. " + e)
        }
    },
}