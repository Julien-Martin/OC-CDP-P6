const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const publicKey = fs.readFileSync('./public_key.pem');

module.exports = {
	isAuth: async (context) => {
		const Authorization = context.request.get('Authorization');
		if (Authorization) {
			const token = Authorization.replace('Bearer ', '');
			try {
				const {id} = jwt.verify(token, publicKey);
				const user = await context.prisma.$exists.user({id: id})
				if (!user) throw new Error("L'utilisateur n'existe pas.")
				return id
			} catch (e) {
				throw new Error('Le token est invalide. ' + e)
			}
		}
		throw new Error("L'authentification a échoué")
	},
	isAdmin: async (context) => {
		const Authorization = context.request.get('Authorization');
		if (Authorization) {
			const token = Authorization.replace('Bearer ', '');
			try {
				const {id, role} = jwt.verify(token, publicKey);
				const user = await context.prisma.$exists.user({id})
				if (!user) throw new Error("L'utilisateur n'existe pas")
				else {
					if (role !== "ADMIN") throw new Error("Vous n'êtes pas administrateur");
					return id
				}
			} catch (e) {
				throw new Error("L'authentification a échoué. " + e)
			}
		}
	},
};
