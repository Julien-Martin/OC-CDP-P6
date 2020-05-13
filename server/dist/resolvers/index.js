"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("./queries/admin");
const user_1 = require("./queries/user");
const auth_1 = require("./mutations/auth");
const user_2 = require("./mutations/user");
const product_1 = require("./mutations/product");
const legalForm_1 = require("./mutations/legalForm");
const client_1 = require("./mutations/client");
const invoice_1 = require("./mutations/invoice");
const estimate_1 = require("./mutations/estimate");
const User_1 = require("./User");
const Product_1 = require("./Product");
const Client_1 = require("./Client");
const Estimate_1 = require("./Estimate");
const Invoice_1 = require("./Invoice");
exports.default = {
    Query: Object.assign(Object.assign({}, admin_1.adminQuery), user_1.userQuery),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, auth_1.authMutation), user_2.userMutation), product_1.productMutation), legalForm_1.legalFormMutation), client_1.clientMutation), invoice_1.invoiceMutation), estimate_1.estimateMutation),
    User: User_1.User,
    Product: Product_1.Product,
    Client: Client_1.Client,
    Estimate: Estimate_1.Estimate,
    Invoice: Invoice_1.Invoice
};
