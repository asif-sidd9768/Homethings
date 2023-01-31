const eventsRouter = require('express').Router()
const Event = require('../models/event')

eventsRouter.get('/', async (req, res) => {
  const events = await Event
    .find({})
  res.send(events)
})

eventsRouter.post('/', async (req, res) => {
  const { title, eventDate, occasion } = req.body
  const event = new Event({
    title,
    eventDate,
    occasion
  })

  await event.save()
  console.log(event)
  res.send(event)
})

module.exports = eventsRouter