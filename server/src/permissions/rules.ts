import { rule, and, or, not } from 'graphql-shield'
import {Context, getAuth} from "../utils";

export const isAdmin = rule()(async (parent, args, context: Context, info) => {
    const {id, role} = await getAuth(context);
    const user = await context.prisma.$exists.user({id});
    if(!user) return new Error("L'utilisateur n'existe pas.");
    if(role !== "ADMIN") return new Error("Vous n'êtes pas administrateur.");
    return true
});

export const isUser = rule()(async (parent, args, context: Context, info) => {
    const {id} = await getAuth(context);
    const user = await context.prisma.$exists.user({id});
    if(!user) return new Error("L'utilisateur n'existe pas.");
    return true
});

export const isAuthenticated = or(isAdmin, isUser);


