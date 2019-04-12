import * as dotenv from "dotenv"
dotenv.config();
const url = process.env.CLIENT_URL;
const mailEmail = process.env.MAILER_EMAIL;

export const welcomeEmail = (email, id) => {
	const text = `
	Bonjour,
	Merci d'avoir choisi ME Assistant!
	Vous avez presque fini votre inscription.
	
	Confirmer votre email:
	${url}/signup/${id}
	`;
	return {
		to: `${email}`,
		from: {
			address: mailEmail,
			name: 'ME Assistant'
		},
		subject: 'Merci de terminer votre inscription',
		text
	}
};