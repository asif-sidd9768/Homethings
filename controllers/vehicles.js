const vehiclesRouter = require('express').Router()
const Vehicle = require('../models/vehicle')
const User = require('../models/user')
const { vehicleCategorize } = require('../utils/vehicleCategorize')

vehiclesRouter.get('/', async (req, res) => {
  try{
    const data = await Vehicle.find({})
    const vehicles = vehicleCategorize(data)
    res.status(201).json(vehicles)
  }catch(error){
    res.status(500).send("Failed to get the vehicles")
  }
})

vehiclesRouter.post('/', async (req, res) => {
  const { name, number, type, warrantyData } = req.body

  const vehicle = new Vehicle({
    name,
    number,
    type,
    warrantyData
  })

  await vehicle.save()
  res.status(201).json(vehicle)
})

vehiclesRouter.post("/edit/:vehicleId", async (req, res) => {
  try{
    const {vehicleId} = req.params
    const newVehicledata = req.body
    console.log(newVehicledata)
    console.log(vehicleId)
    await Vehicle.findByIdAndUpdate(vehicleId, newVehicledata,{new: true})
    const allVehicles = await Vehicle.find({})
    const categorizeVehicles = vehicleCategorize(allVehicles)
    res.send(categorizeVehicles)
  }catch(e){
    res.status(500).send("Failed to update vehicle")
  }
})

module.exports = vehiclesRouter