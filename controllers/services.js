const servicesRouter = require('express').Router()
const Service = require('../models/service')
const _ = require('lodash')

servicesRouter.get('/', async(req, res) => {
  const services = await Service.find({})

  const categorized = _.groupBy(services, 'type');
  console.log(categorized)
  res.send(categorized)
})

servicesRouter.post('/', async(req, res) => {
  const { name, type, mobile, code } = req.body
  const service = new Service({
    name,
    type,
    code,
    mobile
  })

  console.log(service)
  await service.save()
  res.send(service)
})

module.exports = servicesRouter