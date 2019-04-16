import { rule, and, or, not } from 'graphql-shield'
import {Context, getAuth} from "../utils";

export const isAdmin = rule()(async (parent, args, context: Context, info) => {
    //@ts-ignore
    const {id, role} = await getAuth(context)
    const user = await context.prisma.$exists.user({id})
    if(!user) return new Error('Test')
    if(role !== "USER") return new Error('Test 2')
    return true
})

export const isUser = rule()(async (parent, args, context: Context, info) => {
    //@ts-ignore
    const {id} = await getAuth(context)
    const user = await context.prisma.$exists.user({id})
    if(!user) return false
    return true
})

export const isAuthenticated = or(isAdmin, isUser)


