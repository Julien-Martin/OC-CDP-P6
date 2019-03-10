import {adminQuery} from "./queries/admin";
import {userQuery} from "./queries/user";

import {authMutation} from './mutations/auth'
import {userMutation} from './mutations/user'
import {productMutation} from "./mutations/product";
import {legalFormMutation} from "./mutations/legalForm";
import {clientMutation} from "./mutations/client";
import {invoiceMutation} from "./mutations/invoice";
import {estimateMutation} from "./mutations/estimate";

import {User} from './User'
import {Product} from './Product'
import {Client} from './Client'
import {Estimate} from "./Estimate";

export default {
    Query: {
        ...adminQuery,
        ...userQuery
    },
    Mutation: {
        ...authMutation,
        ...userMutation,
        ...productMutation,
        ...legalFormMutation,
        ...clientMutation,
        ...invoiceMutation,
        ...estimateMutation
    },
    User,
    Product,
    Client,
    Estimate,
};