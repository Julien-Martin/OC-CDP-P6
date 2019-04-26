import {Context} from "../../utils";
import {ErrorHandling} from "../../utils/errors";

export const adminMutation = {
    /**
     * Delete user by id or email
     * @param _
     * @param args
     * @param context
     */
    async deleteUser(_, args, context: Context) {
        try {
            const deleted = await context.prisma.deleteUser({id: args.id});
            return !!deleted
        } catch (e) {

        }
    },
    /**
     * Update user by id or email
     * @param _
     * @param args
     * @param context
     */
    async updateUser(_, args, context: Context){
        try {
            let id = args.id;
            delete args.id;
            return await context.prisma.updateUser({
                where: {id},
                data: {
                    ...args
                }
            })
        } catch (e) {
            throw new ErrorHandling("ME002", e.message)
        }
    }
};
