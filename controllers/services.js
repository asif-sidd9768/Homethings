const servicesRouter = require('express').Router()
const Service = require('../models/service')
const _ = require('lodash')

servicesRouter.get('/', async(req, res) => {
  const services = await Service.find({})

  const categorized = _.groupBy(services, 'type');
  console.log(categorized)
  res.send(categorized)
})

servicesRouter.get('/nextGadget', async (req, res) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=4`;
  // Fetch latest videos from YouTube channel
  const response = await fetch(API_URL)
  const data = await response.json()
  res.send(data)
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