import {Context, isAdmin} from "../../utils";

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
            throw new Error('Création impossible. ' + e)
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
        try {
            return await context.prisma.updateLegalForm({
                where: {id: args.id},
                data: args
            })
        } catch (e) {
            throw new Error("Impossible de mettre à jour. " + e)
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
            throw new Error("Impossible de supprimer. " + e)
        }
    },
}