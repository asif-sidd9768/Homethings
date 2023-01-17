const vehiclesRouter = require('express').Router()
const Vehicle = require('../models/vehicle')
const User = require('../models/user')

vehiclesRouter.get('/', async (req, res) => {
  const data = await Vehicle.find({})
  const data1 = await Vehicle.find({}).select("-_id -__v").exec((err, data) => {
    console.log(data)
  })
  let vehicles = {
    cars: [],
    bikes: []
  }
  data.map(vehicle => vehicle.type == "car" ? vehicles.cars.push(vehicle) : vehicles.bikes.push(vehicle))
  console.log(vehicles)
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

module.exports = vehiclesRouter