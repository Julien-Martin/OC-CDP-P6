const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

buildModel = (name, schema) => {
  return mongoose.model(name, new Schema(schema, {timestamps: true}))
}

module.exports.User = buildModel('User', {
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  mail: {
    type: String
  },
  password: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  siret: {
    type: String,
    unique: true
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
  status: String
})
module.exports.Client = buildModel('Client', {
  _userId: {
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
    ref: 'Status',
    required: true
  },
  mail: String,
  address: String,
  phone: String,
  company: String
})
module.exports.Product = buildModel('Product', {
  _userId: {
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
})
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
})
module.exports.Invoice = buildModel('Invoice', {
  _userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  _clientId: {
    type: ObjectId,
    ref: 'Client',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  products: [{
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
      enum: [0, 2.1, 5.5, 10, 20],
      required: true
    },
    pricettc: {
      type: Number,
      required: true
    },
    quantity: Number
  }]
})
