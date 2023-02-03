const mongoose = require('mongoose')

const activeUserSchema = new mongoose.Schema({
  name: String,
  username: String,
  deviceToken: String
})

activeUserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ActiveUser = mongoose.model('ActiveUser', activeUserSchema)

module.exports = ActiveUser