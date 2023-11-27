const eventsRouter = require('express').Router()
const Event = require('../models/event')
const { getAllEvents } = require('../services/eventsFetch')

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
  res.send(event)
})

eventsRouter.get('/all', async (req, res) => {
  try{
    const allEvents = await getAllEvents()
    if(allEvents){
      return res.status(200).send(allEvents)
    }
  }catch(error){
    res.status(500).send(error)
  }
})

module.exports = eventsRouter