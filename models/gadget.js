const mongoose = require('mongoose')

const gadgetSchema = new mongoose.Schema({
  type: String,
  name: String,
  warranty: Boolean,
  warrantyTill: Date  
})

gadgetSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
  }
})

const Gadget = mongoose.model('Gadget', gadgetSchema)

module.exports = Gadget