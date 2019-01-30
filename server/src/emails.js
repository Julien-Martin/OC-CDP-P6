const url = process.env.CLIENT_URL
const fromEmail = process.env.FROM_EMAIL

module.exports.welcomeEmail = (email, user) => {
	const text = `
	Bonjour,
	Merci d'avoir choisi ME Assistant!
	Vous avez presque fini votre inscription.
	
	Confirmer votre email:\n
	${url}/signup/${user.id}
	`
	return {
		to: `${email}`,
		from: {
			address: fromEmail,
			name: 'ME Assistant'
		},
		subject: 'Merci de terminer votre inscription',
		text
	}
}