import {shield, and} from "graphql-shield";
import * as rules from './rules'


export const permissions = shield({
    Query: {
        users: rules.isAdmin,
        products: rules.isAdmin,
        product: rules.isAdmin,
        clients: rules.isAdmin,
        client: rules.isAdmin,
        legalForms: rules.isAuthenticated,
        legalForm: rules.isAdmin,
        invoices: rules.isAdmin,
        invoice: rules.isAdmin,
        invoicesByUser: rules.isAdmin,
        estimates: rules.isAdmin,
        estimate: rules.isAdmin,
        estimatesByUser: rules.isAdmin,
        me: rules.isUser,
        meProducts: rules.isUser,
        meProduct: rules.isUser,
        meClients: rules.isUser,
        meClient: rules.isUser,
        meInvoices: rules.isUser,
        meInvoice: rules.isUser,
        meEstimates: rules.isUser,
        meEstimate: rules.isUser,
    },
    Mutation: {
        createClient: rules.isAuthenticated,
        updateClient: rules.isAuthenticated,
        deleteClient: rules.isAuthenticated,
        createEstimate: rules.isAuthenticated,
        updateEstimate: rules.isAuthenticated,
        validateEstimate: rules.isAuthenticated,
        changeEstimateState: rules.isAuthenticated,
        deleteEstimate: rules.isAuthenticated,
        createInvoice: rules.isAuthenticated,
        updateInvoice: rules.isAuthenticated,
        validateInvoice: rules.isAuthenticated,
        changeInvoiceState: rules.isAuthenticated,
        deleteInvoice: rules.isAuthenticated,
        createLegalForm: rules.isAdmin,
        updateLegalForm: rules.isAdmin,
        deleteLegalForm: rules.isAdmin,
        createProduct: rules.isAuthenticated,
        updateProduct: rules.isAuthenticated,
        deleteProduct: rules.isAuthenticated,
        updateMe: rules.isAuthenticated,
        updatePassword: rules.isAuthenticated,
        deleteMe: rules.isAuthenticated,
        deleteUser: rules.isAdmin
    },
    Client: rules.isAuthenticated,
    Estimate: rules.isAuthenticated,
    Invoice: rules.isAuthenticated,
    Product: rules.isAuthenticated,
}, {
    allowExternalErrors: true,
    debug: true
});