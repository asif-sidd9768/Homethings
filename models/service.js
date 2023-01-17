const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  name: String,
  type: String,
  code: String,
  mobile: String
})

serviceSchema.set('toJSON', {
transform: (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString()
  delete returnedObject._id
  delete returnedObject.__v
  // the passwordHash should not be revealed
}
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service