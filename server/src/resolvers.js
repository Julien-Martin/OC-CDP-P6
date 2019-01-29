const {GraphQLScalarType} = require('graphql')
const moment = require('moment')
const {User} = require('./models')

const resolvers = {
  Query: {
    test(_, args, context) {
      return 'Hello World !'
    }
  },
  Mutation: {
    async captureEmail(_, {mail}) {
      const isEmailTaken = await User.findOne({mail})
      if (isEmailTaken) throw new Error('This email is already taken')
      const user = await User.create({
        mail,
        role: 'User',
        status: 'Pending'
      })
      return user
    },
    async signup(_, {id, firstname, lastname, password}) {
    },
    async login(_, {mail, password}) {
    },
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