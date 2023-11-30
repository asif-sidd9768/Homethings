const vehiclesRouter = require('express').Router()
const Vehicle = require('../models/vehicle')
const User = require('../models/user')

vehiclesRouter.get('/', async (req, res) => {
  const data = await Vehicle.find({})
  const data1 = await Vehicle.find({}).select("-_id -__v").exec((err, data) => {

  })
  let vehicles = {
    cars: [],
    bikes: []
  }
  data.map(vehicle => vehicle.type == "car" ? vehicles.cars.push(vehicle) : vehicles.bikes.push(vehicle))
  res.status(201).json(vehicles)
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
    const foundVehicle = await Vehicle.findByIdAndUpdate(vehicleId, newVehicledata,{new: true})
    res.send(foundVehicle)
  }catch(e){
    res.status(500).send("Failed to update vehicle")
  }
})

module.exports = vehiclesRouter