const {GraphQLScalarType} = require('graphql')
const moment = require('moment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const {welcomeEmail} = require('./emails')
const {getUserId} = require('./utils')

const transporter = nodeMailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.FROM_EMAIL,
		pass: process.env.GMAIL_PASSWORD
	}
})

const {User, Client, Product, Status, Invoice} = require('./models')

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
	Query: {
		async getUser(_, args, context) {
			const userId = getUserId(context)
			return await User.findById(userId).populate('products').populate('clients').populate('invoices')
		},
		async getClients(_, args, context) {
			const userId = getUserId(context)
			return await Client.find({userId: userId})
		},
		async getProducts(_, args, context){
			const userId = getUserId(context)
			return await Product.find({userId: userId})
		},
		async getInvoices(_, args, context){
			const userId = getUserId(context)
			return await Invoice.find({userId: userId})
		}
	},
	Mutation: {
		async captureEmail(_, {email}) {
			const isEmailTaken = await User.findOne({email})
			if (isEmailTaken) throw new Error('This email is already taken')
			const user = await User.create({
				email,
				role: 'User',
				status: 'Pending'
			})
			// Uncomment to send confirmation mail
			//transporter.sendMail(welcomeEmail(email, user))
			return user
		},
		async signup(_, {id, firstname, lastname, password}) {
			const user = await User.findById(id)
			const common = {
				firstname,
				lastname,
				password: await bcrypt.hash(password, 10),
				status: 'Active'
			}
			user.set(common)
			await user.save()
			const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET)
			return {token, user}
		},
		async login(_, {email, password}) {
			const user = await User.findOne({email})
			if (!user) throw new Error('No user with that email')
			const valid = await bcrypt.compare(password, user.password)
			if (!valid) throw new Error('Incorrect password')
			const token = jwt.sign({id: user.id, email}, JWT_SECRET)
			return {token, user}
		},
		async createClient(_, {lastname, firstname, email, address, phone, company}, context) {
			const userId = getUserId(context)
			const client = await Client.create({
				userId: (userId),
				lastname,
				firstname,
				email,
				address,
				phone,
				company
			})
			await User.updateOne({_id: userId}, {$push: {clients: client}})
			return client
		},
		async createProduct(_, {description, priceht, vat, pricettc, unit}, context){
			const userId = getUserId(context)
			const product = await Product.create({
				userId: (userId),
				description,
				priceht,
				vat,
				pricettc,
				unit
			})
			await User.updateOne({_id: userId}, {$push: {products: product}})
			return product
		},
		async createInvoice(_, {clientId, invoiceNumber, deliveryDate, paymentDate, price, products}, context){
			const userId = getUserId(context)
			const invoice = await Invoice.create({
				userId: (userId),
				clientId,
				invoiceNumber,
				deliveryDate,
				paymentDate,
				price,
				products
			})
			await User.updateOne({_id: userId}, {$push: {invoices: invoice}})
			await Client.updateOne({_id: clientId}, {$push: {invoices: invoice}})
			return invoice
		}
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue: (value) => moment(value).toDate(),
		serialize: (value) => value.getTime(),
		parseLiteral: (ast) => ast
	})
}

module.exports = resolvers