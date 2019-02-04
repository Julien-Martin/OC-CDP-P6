const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./private_key.pem');
require('dotenv').config();

const {isAuth, isAdmin} = require('../utils');

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
			return await context.prisma.createProduct({
				...args,
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
			await context.prisma.updateUser({
				where: {id: userId},
				data: {
					products: {
						update: {
							where: {id: id},
							data: args
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
		const legalFormId = args.legalForm
		delete args.legalForm
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
};