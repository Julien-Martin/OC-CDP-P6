import {Context, isAdmin} from "../../utils";
import {ErrorHandling} from "../../utils/errors";

export const legalFormMutation = {
    /**
     * Create Legal Form
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*>}
     */
    createLegalForm: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        try {
            return await context.prisma.createLegalForm({
                ...args
            })
        } catch (e) {
            throw new ErrorHandling("LEGALFORM001", e.message)
        }
    },
    /**
     * Update Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    updateLegalForm: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        const id = args.id;
        delete args.id;
        try {
            return await context.prisma.updateLegalForm({
                where: {id: id},
                data: args
            })
        } catch (e) {
            throw new ErrorHandling("LEGALFORM002", e.message)
        }
    },
    /**
     * Delete Legal Form by id
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    deleteLegalForm: async (_, args, context: Context) => {
        const userId = await isAdmin(context);
        try {
            await context.prisma.deleteLegalForm({id: args.id})
        } catch (e) {
            throw new ErrorHandling("LEGALFORM003", e.message)
        }
    },
};