const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./private_key.pem');
const moment = require('moment');
require('dotenv').config();

const {isAuth, isAdmin} = require('../utils');
const {fragmentUser, fragmentProduct, fragmentClient, fragmentEstimateState, fragmentInvoiceState} = require('../fragments');
const StateEnum = {
	0: "DRAFT",
	1: "PENDING",
	2: "SEND",
	3: "DONE"
};

module.exports = {
	/**
	 * Get email and send confirmation mail to avoid ghost account
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	captureEmail: async (_, args, context) => {
		const isEmailTaken = await context.prisma.user({email: args.email});
		if (isEmailTaken) throw new Error("L'email est déjà utilisé.");
		const user = await context.prisma.createUser({
			email: args.email,
			role: "USER",
			status: "NOTACTIVE"
		});
		return user
	},
	/**
	 * Sign up after confirmation mail, create user and send auth token
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<{user: *, token: *}>}
	 */
	signup: async (_, args, context) => {
		const password = await bcrypt.hash(args.password, 10);
		const user = await context.prisma.updateUser({
			data: {
				...args,
				password,
				role: "USER",
				status: "ACTIVE"
			}, where: {email: args.email}
		});
		const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
			algorithm: process.env.JWT_ALGO,
			expiresIn: process.env.JWT_EXPIRATION
		});
		return {token, user}
	},
	/**
	 * Check if credentials match and send auth token
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<{user: *, token: *}>}
	 */
	login: async (_, args, context) => {
		const user = await context.prisma.user({email: args.email});
		if (!user) throw new Error('No such user found');
		const valid = await bcrypt.compare(args.password, user.password);
		if (!valid) throw new Error('Invalid password');
		const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
			algorithm: process.env.JWT_ALGO,
			expiresIn: process.env.JWT_EXPIRATION
		});
		return {token, user}
	},

	/**
	 * Create product for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|*>}
	 */
	createProduct: async (_, args, context) => {
		const userId = isAuth(context);
		try {
			const priceht = args.pricettc / (1 + args.vat / 100);
			return await context.prisma.createProduct({
				...args,
				priceht: priceht,
				user: {
					connect: {
						id: userId
					}
				},
			})
		} catch (e) {
			throw new Error('Création impossible. ' + e)
		}
	},
	/**
	 * Update product by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	updateProduct: async (_, args, context) => {
		const userId = isAuth(context);
		const id = args.id;
		delete args.id;
		try {
			const priceht = args.pricettc / (1 + args.vat / 100);
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					products: {
						update: {
							where: {id: id},
							data: {
								...args,
								priceht: priceht
							}
						}
					}
				}
			});
			return await context.prisma.product({id: id})
		} catch (e) {
			throw new Error('Impossible de mettre à jour. ' + e)
		}
	},
	/**
	 * Delete product by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<boolean>}
	 */
	deleteProduct: async (_, args, context) => {
		const userId = isAuth(context);
		try {
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					products: {
						delete: {
							id: args.id
						}
					}
				}
			});
			return true
		} catch (e) {
			throw new Error('Impossible de supprimer. ' + e)
		}
	},

	/**
	 * Create Legal Form
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	createLegalForm: async (_, args, context) => {
		const userId = isAuth(context);
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
	updateLegalForm: async (_, args, context) => {
		const userId = isAuth(context);
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
	deleteLegalForm: async (_, args, context) => {
		const userId = isAuth(context);
		try {
			await context.prisma.deleteLegalForm({id: args.id})
		} catch (e) {
			throw new Error("Impossible de supprimer. " + e)
		}
	},

	/**
	 * Create client for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|*>}
	 */
	createClient: async (_, args, context) => {
		const userId = isAuth(context);
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
			throw new Error("Création impossible. " + e)
		}
	},
	/**
	 * Update client by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<void>}
	 */
	updateClient: async (_, args, context) => {
		const userId = isAuth(context);
		const id = args.id;
		delete args.id;
		try {
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					clients: {
						update: {
							where: {id: id},
							data: args
						}
					}
				}
			});
			return await context.prisma.client({id: id})
		} catch (e) {
			throw new Error("Impossible de mettre à jour. " + e)
		}
	},
	/**
	 * Delete client by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<boolean>}
	 */
	deleteClient: async (_, args, context) => {
		const userId = isAuth(context);
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
			throw new Error("Impossible de supprimer. " + e)
		}
	},

	/**
	 * Create invoice with static client user and products
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|*>}
	 */
	createInvoice: async (_, args, context) => {
		const userId = isAuth(context);
		const clientId = args.clientId;
		delete args.clientId;
		const user = await context.prisma.user({id: userId}).$fragment(fragmentUser);
		const client = await context.prisma.client({id: clientId}).$fragment(fragmentClient);
		const products = args.products;
		let price = 0;
		for (let i = 0; i < products.length; i++) {
			products[i].product = await context.prisma.product({id: products[i].product}).$fragment(fragmentProduct);
			price += products[i].product.pricettc * products[i].quantity
		}
		const invoiceCounter = await context.prisma.invoicesConnection({where: {userId}}).aggregate().count()
		const invoiceNumber = moment().format('YYYY-MM-') + (invoiceCounter + 1);
		const deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
		try {
			const invoice = await context.prisma.createInvoice({
				...args,
				userId,
				state: StateEnum["0"],
				user,
				client,
				price,
				deadline,
				invoiceNumber,
				products: {
					create: products
				}
			});
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						connect: {id: invoice.id}
					}
				}
			});
			await context.prisma.updateClient({
				where: {id: clientId},
				data: {
					invoices: {
						connect: {id: invoice.id}
					}
				}
			});
			return invoice
		} catch (e) {
			throw new Error("Impossible de créer une facture. " + e)
		}
	},
	/**
	 * Update invoice by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|boolean>}
	 */
	updateInvoice: async (_, args, context) => {
		const userId = isAuth(context);
		const id = args.id;
		delete args.id;
		if (args.products) {
			for (let i = 0; i < args.products.length; i++) {
				args.products[i].product = await context.prisma.product({id: args.products[i].product}).$fragment(fragmentProduct);
				args.price += args.products[i].product.pricettc * args.products[i].quantity
			}
		}
		args.deadline = moment(args.billingDate).add(args.paymentCondition, 'days');
		try {
			const invoiceState = await context.prisma.invoice({id: id}).$fragment(fragmentInvoiceState);
			if (invoiceState.state !== StateEnum["0"]) throw new Error("Cette facture a déjà été validé. , vous ne pouvez donc pas la modifier.");

			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						update: {
							where: {id: id},
							data: {
								...args,
								products: {
									create: args.products
								}
							}
						}
					}
				}
			});
			return await context.prisma.invoice({id: id})
		} catch (e) {
			throw new Error('Impossible de mettre à jour. ' + e)
		}
	},
	/**
	 * Change invoice state to PENDING, SEND or DONE
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|Promise<*>|Promise<boolean>|InvoicePromise|InvoiceSubscriptionPayloadSubscription>}
	 */
	changeInvoiceState: async (_, args, context) => {
		const userId = isAuth(context);
		try {
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						update: {
							where: {id: args.id},
							data: {state: StateEnum[args.state]}
						}
					}
				}
			});
			return context.prisma.invoice({id: args.id})
		} catch (e) {
			throw new Error("Impossible de valider. " + e)
		}
	},
	/**
	 * Delete invoice by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<boolean>}
	 */
	deleteInvoice: async (_, args, context) => {
		const userId = isAuth(context);
		try {
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						delete: {id: args.id}
					}
				}
			});
			return true
		} catch (e) {
			throw new Error('Impossible de supprimer. ' + e)
		}
	},

	/**
	 * Create estimate with static client user and products
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*|*>}
	 */
	createEstimate: async (_, args, context) => {
		const userId = isAuth(context);
		const clientId = args.clientId;
		delete args.clientId
		const user = await context.prisma.user({id: userId}).$fragment(fragmentUser)
		const client = await context.prisma.client({id: clientId}).$fragment(fragmentClient)
		const products = args.products
		let price = 0
		for (let i = 0; i < products.length; i++) {
			products[i].product = await context.prisma.product({id: products[i].product}).$fragment(fragmentProduct)
			price += products[i].product.pricettc * products[i].quantity
		}
		const estimateCounter = await context.prisma.estimatesConnection({where: {userId}}).aggregate().count()
		const estimateNumber = moment().format('YYYY-MM-') + (estimateCounter + 1);
		try {
			const estimate = await context.prisma.createEstimate({
				...args,
				state: 'DRAFT',
				userId,
				user,
				client,
				price,
				estimateNumber,
				products: {
					create: products
				}
			})
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					estimates: {
						connect: {id: estimate.id}
					}
				}
			})
			await context.prisma.updateClient({
				where: {id: clientId},
				data: {
					estimates: {
						connect: {id: estimate.id}
					}
				}
			})
			return estimate
		} catch (e) {
			throw new Error("Impossible de créer un devis. " + e)
		}
	},
	/**
	 * Update estimate by id for current user
	 * @param _
	 * @param args
	 * @param context
	 * @returns {Promise<*>}
	 */
	updateEstimate: async (_, args, context) => {
		const userId = isAuth(context)
		const id = args.id
		delete args.id
		if (args.products) {
			for (let i = 0; i < args.products.length; i++) {
				args.products[i].product = await context.prisma.product({id: args.products[i].product}).$fragment(fragmentProduct)
				args.price += args.products[i].product.pricettc * args.products[i].quantity
			}
		}
		try {
			const estimateState = await context.prisma.estimate({id: id}).$fragment(fragmentEstimateState)
			if (estimateState.state !== "DRAFT") throw new Error("Ce devis a déjà été validé, vous ne pouvez donc pas le modifier. ")
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					estimates: {
						update: {
							where: {id},
							data: {
								...args,
								products: {
									create: args.products
								}
							}
						}
					}
				}
			})
			return await context.prisma.estimate({id})
		} catch (e) {
			throw new Error("Impossible de mettre à jour. " + e)
		}
	},
	changeEstimateState: async (_, args, context) => {
		const userId = isAuth(context)
		try {
			const invoiceState = await context.prisma.invoice({id: args.id}).$fragment(fragmentInvoiceState)
			if(invoiceState.state !== StateEnum["0"]) throw new Error("Vous ne pouvez pas supprimer un devis déjà validé. ")
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						update: {
							where: {id: args.id},
							data: {state: StateEnum[args.state]}
						}
					}
				}
			})
		} catch (e) {
			throw new Error("Impossible de valider. " + e)
		}
	},
	deleteEstimate: async(_, args, context) => {
		const userId = isAuth(context);
		try {
			const estimateState = await context.prisma.estimate({id: args.id}).$fragment(fragmentEstimateState)
			if(estimateState.state !== StateEnum["0"]) throw new Error("Vous ne pouvez pas supprimer une facture déjà validé. ")
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					invoices: {
						delete: {id: args.id}
					}
				}
			})
			return true
		} catch (e) {
			throw new Error("Impossible de supprimer. " + e)
		}
	},
};