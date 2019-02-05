const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const publicKey = fs.readFileSync('./public_key.pem');

module.exports = {
	isAuth: (context) => {
		const Authorization = context.request.get('Authorization');
		if (Authorization) {
			const token = Authorization.replace('Bearer ', '');
			try {
				const {id} = jwt.verify(token, publicKey);
				return id
			} catch (e) {
				throw new Error('Le token est invalide')
			}
		}
		throw new Error("L'authentification a échoué")
	},
	isAdmin: (context) => {
		const Authorization = context.request.get('Authorization');
		if (Authorization) {
			const token = Authorization.replace('Bearer ', '');
			try {
				const user = jwt.verify(token, publicKey);
				if (user.role !== "ADMIN") throw ("Vous n'êtes pas administrateur");
				return user.id
			}
			 catch (e) {
				throw new Error("L'authentification a échoué. "+ e)
			}
		}
	},
};
