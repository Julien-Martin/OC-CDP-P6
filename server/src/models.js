const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

buildModel = (name, schema) => {
  return mongoose.model(name, new Schema(schema, {timestamps: true}))
};

module.exports.User = buildModel('User', {
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
		required: true,
		unique: true
  },
  password: {
    type: String,
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  siret: {
    type: String,
  },
  useVAT: {
    type: Boolean,
    default: false
  },
  paymentInfo: String,
  VATnumber: String,
  RCS: String,
  RM: String,
  commercialName: String,
  ape: String,
  role: String,
  status: String,
  cgv: String,
  products: [{
    type: ObjectId,
    ref: 'Product'
  }],
  clients: [{
    type: ObjectId,
    ref: 'Client'
  }],
  invoices: [{
    type: ObjectId,
    ref: 'Invoice'
  }],
  estimates: [{
    type: ObjectId,
    ref: 'Estimate'
  }]
});
module.exports.Client = buildModel('Client', {
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  status: {
    type: ObjectId,
    ref: 'Status'
  },
  email: String,
  address: String,
  phone: String,
  company: String,
  invoices: [{
    type: ObjectId,
    ref: 'Invoice'
  }],
  estimates: [{
    type: ObjectId,
    ref: 'Estimate'
  }]
});
module.exports.Product = buildModel('Product', {
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priceht: {
    type: Number,
    required: true
  },
  vat: {
    type: Number,
    enum: [0, 0.2, 5.5, 10, 20],
    required: true
  },
  pricettc: {
    type: Number,
    required: true
  },
  unit: String
});
module.exports.Status = buildModel('Status', {
  form: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    unique: true,
    required: true
  }
});
module.exports.Invoice = buildModel('Invoice', {
  userId: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['Draft', 'Pending', 'Done'],
    required: true
  },
  user: {
    type: Mixed,
    required: true
  },
  client: {
    type: Mixed,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  billingDate: {
    type: Date,
    required: true
  },
  paymentCondition: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  lateFee: {
    type: Number,
    required: true
  },
  message: {
    type: String
  },
  products: [{
    product: {
      type: Mixed,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  price: {
    type: Number,
    required: true
  },
  footNote: {
    type: String
  }
});
module.exports.Estimate = buildModel('Estimate', {
  userId: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['Draft', 'Pending', 'Done'],
    required: true
  },
	user: {
	  type: Mixed,
    required: true
  },
  client: {
	  type: Mixed,
    required: true
  },
  estimateNumber: {
	  type: String,
    required: true
  },
  startedDate: {
	  type: Date,
    required: true
  },
  deliveryDate: {
	  type: Date,
    required: true
  },
  validityDate: {
	  type: Date,
    required: true
  },
  message: {
	  type: String
  },
  price: {
	  type: Number,
    required: true
  },
  products: [{
	  product: {
	    type: Mixed,
      required: true
    },
    quantity: {
	    type: Number,
      required: true
    }
  }],
  footNote: {
	  type: String
  }
});