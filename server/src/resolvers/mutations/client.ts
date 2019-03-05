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
            throw new Error(e)
            //throw new ErrorHandling("CLIENT001")
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
        console.log("Clients args : "+ args)
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
            throw new Error(e)
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
            throw new Error(e)
        }
    },
};