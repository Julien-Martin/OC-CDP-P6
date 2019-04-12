import {Context, isAuth} from "../../utils";
import {ErrorHandling} from "../../utils/errors";

export const clientMutation = {
    /**
     * Create client for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<*|*>}
     */
    createClient: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        const legalFormId = args.legalForm;
        delete args.legalForm;
        try {
            return await context.prisma.createClient({
                ...args,
                legalForm: {
                    connect: {
                        id: legalFormId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            })
        } catch (e) {
            throw new ErrorHandling("CLIENT001", e.message)
        }
    },
    /**
     * Update client by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<void>}
     */
    updateClient: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        const id = args.id;
        const legalFormId = args.legalForm;
        delete args.legalForm;
        delete args.id;
        try {
            await context.prisma.updateClient({
                where: {id: id},
                data: {
                    ...args,
                    legalForm: {
                        connect: {
                            id: legalFormId
                        }
                    },
                }
            });
            return await context.prisma.client({id: id})
        } catch (e) {
            throw new ErrorHandling("CLIENT002", e.message)
        }
    },
    /**
     * Delete client by id for current user
     * @param _
     * @param args
     * @param context
     * @returns {Promise<boolean>}
     */
    deleteClient: async (_, args, context: Context) => {
        const userId = await isAuth(context);
        try {
            let estimateCounter = (await context.prisma.client({id: args.id}).estimates()).length;
            let invoiceCounter = (await context.prisma.client({id: args.id}).invoices()).length;
            if(estimateCounter) throw ("Ce client a des devis associés.");
            if(invoiceCounter) throw ("Ce client a des factures associés.");
            await context.prisma.updateUser({
                where: {id: userId},
                data: {
                    clients: {
                        delete: {id: args.id}
                    }
                }
            });
            return true
        } catch (e) {
            throw new ErrorHandling("CLIENT003", e)
        }
    },
};