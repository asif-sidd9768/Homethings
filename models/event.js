const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: String,
  eventDate: Date,
  occasion: String
})

eventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event