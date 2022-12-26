const mongoose = require('mongoose')

const insuranceSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  company: String
})

const pucSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date
})

const servicesSchema = new mongoose.Schema({
  lastServiceDate: Date,
  lastServiceKms: Number,
  nextServiceKms: Number
})

const warrantyDataSchema = mongoose.Schema({
  insurance: insuranceSchema,
  Puc: pucSchema,
  services: servicesSchema
})

const vehicleSchema = new mongoose.Schema({
    name: String,
    number: String,
    type: String,
    warrantyData: warrantyDataSchema
})

vehicleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
  }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = Vehicle