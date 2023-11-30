const express = require('express')
const cors = require('cors')
const app = express()
const cron = require("node-cron")
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const gadgetsRouter = require('./controllers/gadgets')
const vehiclesRouter = require('./controllers/vehicles')
const eventsRouter = require('./controllers/events')
const servicesRouter = require('./controllers/services')
const funRouter = require('./controllers/fun')
const nGRouter = require('./controllers/nextGadget')
const activeUserRouter = require('./controllers/activeUser')
const ActiveUser = require('./models/activeUser')
const {Expo} = require('expo-server-sdk')
const { getUsersWithBirthdayInCurrentMonth, sendBirthdayNotifications, getUsersWithBirthdayTomorrow } = require('./services/birthdayCheck')
const User = require('./models/user')
const Vehicle = require('./models/vehicle')
const Event = require('./models/event')
const { getAllEvents } = require('./services/eventsFetch')
// const runningTheCronEvery = require('./controllers/activeUser')
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
app.use('/api/activeUser', activeUserRouter)

cron.schedule('0 0 1 * *', async () => {
  let body
  const title = "Birthday"
  const bdays = await getUsersWithBirthdayInCurrentMonth()
  if(bdays.length > 1){
    body = `${bdays.length} people have birthdays this month.`
  }
  if(bdays.length  === 1){
    body = `${bdays[0].name} has a birthday this month.`
  }
  if(bdays.length < 1){
    body = "No birthdays this month"
  }
  sendBirthdayNotifications(title, body)
  console.log('Running a task on the 1st of every month');
});

cron.schedule('0 0 * * *', async () => {
  // sendBirthdayNotifications('5 people have a birthday this month');
  const bdays = await getUsersWithBirthdayTomorrow()
  let body
  const title = "Birthday"
  if(bdays.length > 1){
    body = `${bdays.length} people have birthdays tomorrow.`
  }
  if(bdays.length  === 1){
    body = `${bdays[0].name} has a birthday tomorrow.`
  }
  if(bdays.length < 1){
    body = "No birthdays this month"
  }
  sendBirthdayNotifications(title, body)
  console.log('Running a task every day at midnight');
});

getAllEvents()

module.exports = app
