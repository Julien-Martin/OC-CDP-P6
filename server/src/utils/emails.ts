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

export const forgotPasswordEmail = (email, id) => {
    const text = `
	Bonjour,
	Vous avez oublié votre mot de passe.
	Cliquez sur le lien pour le changer.
	${url}/forgot/${id}
	`;
    return {
        to: email,
        from: {
            address: mailEmail,
            name: 'ME Assistant'
        },
        subject: 'Mot de passe oublié',
        text
    }
};