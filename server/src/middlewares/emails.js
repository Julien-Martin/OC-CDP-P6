const url = process.env.CLIENT_URL;
const mailEmail = process.env.MAILER_EMAIL;

module.exports.welcomeEmail = (email, user) => {
	const text = `
	Bonjour,
	Merci d'avoir choisi ME Assistant!
	Vous avez presque fini votre inscription.
	
	Confirmer votre email:
	${url}/signup/${user.id}
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