const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = fs.readFileSync('./private_key.pem')
require('dotenv').config();

const {isAuth, isAdmin} = require('../utils')

module.exports = {
	captureEmail: async (_, args, context) => {
		const isEmailTaken = await context.prisma.user({email: args.email})
		if (isEmailTaken) throw new Error("L'email est déjà utilisé.")
		const user = await context.prisma.createUser({
			email: args.email,
			role: "USER",
			status: "NOTACTIVE"
		})
		return user
	},
	signup: async (_, args, context) => {
		const password = await bcrypt.hash(args.password, 10)
		const user = await context.prisma.updateUser({
			data: {
				...args,
				password,
				role: "USER",
				status: "ACTIVE"
			}, where: {email: args.email}
		})
		const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
			algorithm: process.env.JWT_ALGO,
			expiresIn: process.env.JWT_EXPIRATION
		})
		return {token, user}
	},
	login: async (_, args, context) => {
		const user = await context.prisma.user({email: args.email})
		if (!user) throw new Error('No such user found')
		const valid = await bcrypt.compare(args.password, user.password)
		if (!valid) throw new Error('Invalid password')
		const token = jwt.sign({id: user.id, role: user.role}, privateKey, {
			algorithm: process.env.JWT_ALGO,
			expiresIn: process.env.JWT_EXPIRATION
		})
		return {token, user}
	},

	createProduct: async (_, args, context) => {
		const userId = isAuth(context)
		return await context.prisma.createProduct({
			...args,
			user: {
				connect: {
					id: userId
				}
			},
		})
	},
	updateProduct: async (_, args, context) => {
		const userId = isAuth(context)
		const id = args.id
		delete args.id
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
			})
			return await context.prisma.product({id: id})
		} catch (e) {
			throw new Error('Impossible de mettre à jour.' + e)
		}
	},
	deleteProduct: async (_, args, context) => {
		const userId = isAuth(context)
		await context.prisma.updateUser({
			where: {id: userId},
			data: {
				products: {
					delete: {
						id: args.id
					}
				}
			}
		})
		return true
	}
}