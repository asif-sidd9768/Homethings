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
const { getUsersWithBirthdayInCurrentMonth } = require('./services/birthdayCheck')
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

const sendBirthdayNotifications = async (message) => {
  console.log("SCHEDULED THE JOB")
  // const currentDate = new Date();

  // Find active users whose birthday is today
  const activeUsers = await ActiveUser.find({}) 
  console.log(activeUsers)
  let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  let messages = [];
  for (let activeUser of activeUsers) {
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: activeUser.deviceToken,
      sound: 'default',
      body: message,
      data: { withSome: 'data', icon:"./assets/icons/app-icon.png" },
    })
  }
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

cron.schedule('*/20 * * * * *', async () => {
  const bdays = await getUsersWithBirthdayInCurrentMonth()
  let message
  if(bdays.length > 1){
    message = `${bdays.length} people have birthday this month.`
  }
  if(bdays.length  === 1){
    message = `${bdays[0].name} has a birthday this month.`
  }
  sendBirthdayNotifications(message)
  console.log('running a task every 20 secs');
});

cron.schedule('0 0 1 * *', async () => {
  // sendBirthdayNotifications('5 people have a birthday this month');
  let message
  const bdays = await getUsersWithBirthdayInCurrentMonth()
  if(bdays.length > 1){
    message = `${bdays.length} people have birthday this month.`
  }
  if(bdays.length  === 1){
    message = `${bdays[0].name} has a birthday this month.`
  }
  sendBirthdayNotifications(message)
  console.log('Running a task on the 1st of every month');
});

cron.schedule('0 0 * * *', () => {
  // sendBirthdayNotifications('5 people have a birthday this month');
  console.log('Running a task every day at midnight');
});

// runningTheCronEvery()

module.exports = app
