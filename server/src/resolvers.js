const {GraphQLScalarType} = require('graphql');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const {welcomeEmail} = require('./emails');
const {getUserId, getUserForInvoice, getClientForInvoice, getProductForInvoice} = require('./utils');

const transporter = nodeMailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.FROM_EMAIL,
		pass: process.env.GMAIL_PASSWORD
	}
});

const {User, Client, Product, Status, Invoice} = require('./models');

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
	Query: {
		async getUser(_, args, context) {
			const userId = getUserId(context);
			return await User.findById(userId).populate('products').populate('clients').populate('invoices')
		},
		async getClients(_, args, context) {
			const userId = getUserId(context);
			return await Client.find({userId: userId})
		},
		async getProducts(_, args, context){
			const userId = getUserId(context);
			return await Product.find({userId: userId})
		},
		async getInvoices(_, args, context){
			const userId = getUserId(context);
			return await Invoice.find({userId: userId})
		},
		async getStatus(_, args, context){
			return await Status.find({})
		}
	},
	Mutation: {
		async captureEmail(_, {email}) {
			const isEmailTaken = await User.findOne({email});
			if (isEmailTaken) throw new Error('This email is already taken');
			const user = await User.create({
				email,
				role: 'User',
				status: 'Pending'
			});
			// Uncomment to send confirmation mail
			//transporter.sendMail(welcomeEmail(email, user))
			return user
		},
		async signup(_, {id, firstname, lastname, password}) {
			const user = await User.findById(id);
			const common = {
				firstname,
				lastname,
				password: await bcrypt.hash(password, 10),
				status: 'Active'
			};
			user.set(common);
			await user.save();
			const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET);
			return {token, user}
		},
		async login(_, {email, password}) {
			const user = await User.findOne({email});
			if (!user) throw new Error('No user with that email');
			const valid = await bcrypt.compare(password, user.password);
			if (!valid) throw new Error('Incorrect password');
			const token = jwt.sign({id: user.id, email}, JWT_SECRET);
			return {token, user}
		},

		async createClient(_, {lastname, firstname, email, address, phone, company}, context) {
			const userId = getUserId(context);
			const client = await Client.create({
				userId: (userId),
				lastname,
				firstname,
				email,
				address,
				phone,
				company
			});
			await User.updateOne({_id: userId}, {$push: {clients: client}});
			return client
		},
		async updateClient(_, data){
			return await Client.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteClient(_, {id}, context){
			const userId = getUserId(context);
			await Client.deleteOne({_id: id});
			await User.updateOne({_id: userId}, {$pull: {clients: id}});
			return true
		},

		async createProduct(_, {description, priceht, vat, pricettc, unit}, context){
			const userId = getUserId(context);
			const product = await Product.create({
				userId: (userId),
				description,
				priceht,
				vat,
				pricettc,
				unit
			});
			await User.updateOne({_id: userId}, {$push: {products: product}});
			return product
		},
		async updateProduct(_, data){
			return await Product.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteProduct(_, {id}, context){
			const userId = getUserId(context);
			await Product.deleteOne({_id: id});
			await User.updateOne({_id: userId}, {$pull: {products: id}});
			return true
		},

		async createInvoice(_, {clientId, invoiceNumber, deliveryDate, paymentDate, price, products}, context){
			const userId = getUserId(context);
			const user = getUserForInvoice(await User.findById(userId));
			const client = getClientForInvoice(await Client.findById(clientId));
			for (let i = 0; i < products.length; i++){
				products[i].product = getProductForInvoice(await Product.findById(products[i].product))
			}
			const invoice = await Invoice.create({
				user: (user),
				client: (client),
				invoiceNumber,
				deliveryDate,
				paymentDate,
				price,
				products,
				isValidate: false
			});
			await User.updateOne({_id: userId}, {$push: {invoices: invoice}});
			await Client.updateOne({_id: clientId}, {$push: {invoices: invoice}});
			return invoice
		},
		async validateInvoice(_, {id}, context){
			const invoice = await Invoice.findById({_id: id})
			if(invoice.isValidate){
				throw new Error('This invoice is already validate')
			}
			return await Invoice.findOneAndUpdate({_id: id}, {isValidate: true}, {new: true})
		},
		async updateInvoice(_, data){
			const invoice = await Invoice.findById(data.id)
			if(invoice.isValidate){
				throw new Error('You cannot modify validate invoice')
			}
			return await Invoice.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteInvoice(_, {id}, context){
			const userId = getUserId(context)
			const invoice = await Invoice.findById({_id: id})
			const client = await Client.findOne({invoices: id})
			const clientId = client._id
			if(invoice.isValidate){
				throw new Error('You cannot delete validate invoice')
			} else {
				await Invoice.deleteOne({_id: id})
				await User.updateOne({_id: userId}, {$pull: {invoices: id}})
				await Client.updateOne({_id: clientId}, {$pull: {invoices: id}})
				return true
			}
		},

		async createStatus(_, {form, title}){
			const status = await Status.findOne({$or: [{form: form}, {title: title}]})
			if(status) throw new Error('Status already exist')
			return await Status.create({form, title})
		},
		async updateStatus(_, data){
			const status = await Status.findOne({$or: [{form: data.form}, {title: data.title}]})
			if(status) throw new Error('Duplicate status')
			return await Status.update({_id: data.id}, data, {new: true})
		},
		async deleteStatus(_, {id}){
			await Status.deleteOne({_id: id})
			return true
		}
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue: (value) => moment(value).toDate(),
		serialize: (value) => value.getTime(),
		parseLiteral: (ast) => ast
	})
};

module.exports = resolvers;