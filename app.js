const express = require('express')
const cors = require('cors')
const app = express()
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const gadgetsRouter = require('./controllers/gadgets')
const vehiclesRouter = require('./controllers/vehicles')
const eventsRouter = require('./controllers/events')
const servicesRouter = require('./controllers/services')
const funRouter = require('./controllers/fun')
const nGRouter = require('./controllers/nextGadget')
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('CONEECTED TO MONGOOSE === ')
})
.catch((error) => {
  console.log('error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/gadgets', gadgetsRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/api/events', eventsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/fun', funRouter)
app.use('/api/nextGadget', nGRouter)

module.exports = app
