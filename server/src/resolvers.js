const {GraphQLScalarType} = require('graphql');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const {welcomeEmail} = require('./emails');
const {getUserId, getUserForDocument, getClientForDocument, getProductForDocument, getPrice} = require('./utils');

const transporter = nodeMailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.FROM_EMAIL,
		pass: process.env.GMAIL_PASSWORD
	}
});

const {User, Client, Product, Status, Invoice, Estimate} = require('./models');

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
	Query: {
		async getUsers(_, args, context) {
			console.log('2. resolver')
			console.log(args.user)

			return await User.find({}).populate('products').populate('clients').populate('invoices')
		},
		async getUser(_, {id}, context) {
			return await User.findById(id).populate('products').populate('clients').populate('invoices')
		},
		async getMe(_, args, context) {
			const userId = getUserId(context);
			return await User.findById(userId).populate('products').populate('clients').populate('invoices')
		},
		async getClients(_, args, context) {
			const userId = getUserId(context);
			return await Client.find({userId: userId}).populate('invoices')
		},
		async getClient(_, {id}, context) {
			return await Client.findById(id).populate('invoices')
		},
		async getProducts(_, args, context) {
			const userId = getUserId(context);
			return await Product.find({userId: userId})
		},
		async getProduct(_, {id}, context) {
			return await Product.findById(id)
		},
		async getInvoices(_, args, context) {
			const userId = getUserId(context);
			return await Invoice.find({userId: userId})
		},
		async getInvoice(_, {id}, context) {
			return await Invoice.findById(id)
		},
		async getEstimates(_, args, context){
			const userId = getUserId(context);
			return await Estimate.find({userId: userId})
		},
		async getEstimate(_, {id}, context){
			return await Estimate.findById(id)
		},
		async getStatus(_, args, context) {
			return await Status.find({})
		},
		async getOneStatus(_, {id}, context) {
			return await Status.findById(id)
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
		async updateClient(_, data) {
			return await Client.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteClient(_, {id}, context) {
			const userId = getUserId(context);
			await Client.deleteOne({_id: id});
			await User.updateOne({_id: userId}, {$pull: {clients: id}});
			return true
		},

		async createProduct(_, {description, priceht, vat, pricettc, unit}, context) {
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
		async updateProduct(_, data) {
			return await Product.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteProduct(_, {id}, context) {
			const userId = getUserId(context);
			await Product.deleteOne({_id: id});
			await User.updateOne({_id: userId}, {$pull: {products: id}});
			return true
		},

		async createInvoice(_, {clientId, invoiceNumber, billingDate, paymentCondition, lateFee, message, products, footNote}, context) {
			const userId = getUserId(context);
			const user = getUserForDocument(await User.findById(userId));
			const client = getClientForDocument(await Client.findById(clientId));
			const deadline = moment(billingDate).add(paymentCondition, 'days');
			for (let i = 0; i < products.length; i++) {
				products[i].product = getProductForDocument(await Product.findById(products[i].product))
			}
			let price = getPrice(products);
			const invoice = await Invoice.create({
				userId,
				user,
				client,
				invoiceNumber,
				billingDate,
				paymentCondition,
				lateFee,
				message,
				products,
				deadline,
				price,
				footNote,
				state: 'Draft'
			});
			await User.updateOne({_id: userId}, {$push: {invoices: invoice}});
			await Client.updateOne({_id: clientId}, {$push: {invoices: invoice}});
			return invoice
		},
		async validateInvoice(_, {id}) {
			const invoice = await Invoice.findById({_id: id});
			if (invoice.state !== 'Draft') {
				throw new Error('This invoice is already validate')
			}
			return await Invoice.findOneAndUpdate({_id: id}, {state: 'Pending'}, {new: true})
		},
		async updateInvoice(_, data) {
			const invoice = await Invoice.findById(data.id);
			if (invoice.state !== 'Draft') {
				throw new Error('You cannot modify validate invoice')
			}
			for (let i = 0; i < data.products.length; i++) {
				data.products[i].product = getProductForDocument(await Product.findById(data.products[i].product))
			}
			data.price = getPrice(data.products);
			return await Invoice.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteInvoice(_, {id}, context) {
			const userId = getUserId(context);
			const invoice = await Invoice.findById({_id: id});
			const client = await Client.findOne({invoices: id});
			const clientId = client._id;
			if (invoice.state !== 'Draft') {
				throw new Error('You cannot delete validate invoice')
			} else {
				await Invoice.deleteOne({_id: id});
				await User.updateOne({_id: userId}, {$pull: {invoices: id}});
				await Client.updateOne({_id: clientId}, {$pull: {invoices: id}});
				return true
			}
		},

		async createEstimate(_, {clientId, estimateNumber, startedDate, deliveryDate, validityDate, message, products, footNote}, context) {
			const userId = getUserId(context);
			const user = getUserForDocument(await User.findById(userId));
			const client = getClientForDocument(await Client.findById(clientId));
			for (let i = 0; i < products.length; i++) {
				products[i].product = getProductForDocument(await Product.findById(products[i].product))
			}
			let price = getPrice(products);
			const estimate = await Estimate.create({
				userId,
				user,
				client,
				price,
				estimateNumber,
				startedDate,
				deliveryDate,
				validityDate,
				message,
				products,
				footNote,
				state: 'Draft'
			});
			await User.updateOne({_id: userId}, {$push: {estimates: estimate}});
			await Client.updateOne({_id: clientId}, {$push: {estimates: estimate}});
			return estimate
		},
		async validateEstimate(_, {id}){
			const estimate = await Estimate.findById(id);
			if(estimate.state !== 'Draft') throw new Error('This estimate is already validate');
			return await Estimate.findOneAndUpdate({_id: id}, {state: 'Pending'}, {new: true})
		},
		async updateEstimate(_, data){
			const estimate = await Estimate.findById(data.id);
			for(let i = 0; i < data.products.length; i++){
				data.products[i].product = getProductForDocument(await Product.findById(data.products[i].product))
			}
			data.price = getPrice(data.products);
			return await Estimate.findOneAndUpdate({_id: data.id}, data, {new: true})
		},
		async deleteEstimate(_, {id}, context){
			const userId = getUserId(context);
			const estimate = await Estimate.findById(id);
			const client = await Client.findOne({invoices: id});
			const clientId = client._id;
			if(estimate.state !== 'Draft') throw new Error('You cannot delete validate estimate');
			await Estimate.deleteOne({_id: id});
			await User.updateOne({_id: userId}, {$pull: {estimates: id}});
			await Client.updateOne({_id: clientId}, {$pull: {estimates: id}});
			return true
		},

		async createStatus(_, {form, title}) {
			const status = await Status.findOne({$or: [{form: form}, {title: title}]});
			if (status) throw new Error('Status already exist');
			return await Status.create({form, title})
		},
		async updateStatus(_, data) {
			const status = await Status.findOne({$or: [{form: data.form}, {title: data.title}]});
			if (status) throw new Error('Duplicate status');
			return await Status.update({_id: data.id}, data, {new: true})
		},
		async deleteStatus(_, {id}) {
			await Status.deleteOne({_id: id});
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