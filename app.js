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


// cron.schedule('*/20 * * * * *', async () => {
//   const bdays = await getUsersWithBirthdayTomorrow()
//   let body
//   const title = "Birthday"
//   if(bdays.length > 1){
//     body = `${bdays.length} people have birthdays tomorrow.`
//   }
//   if(bdays.length  === 1){
//     body = `${bdays[0].name} has a birthday tomorrow.`
//   }
//   if(bdays.length < 1){
//     body = "No birthdays this month"
//   }
//   sendBirthdayNotifications(title, body)
//   console.log('running a task every 20 secs');
// });

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


// const getEventsWithinMonth = async (model, dayAttribute) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1;

//   try {
//     const events = await model.find({
//       $expr: {
//         $eq: [{ $month: `$${dayAttribute}` }, currentMonth],
//       },
//     });
//     const formattedEvents = events.map(event => ({id: event.id, title: event.title || event.name, date: event[dayAttribute]}))
//     return formattedEvents;
//   } catch (error) {
//     console.error(`Error retrieving events for ${model.modelName}:`, error);
//     return [];
//   }
// };

// const getVehicleEventsWithinMonth = async (model, dayAttribute) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1;
//   try {
//     const events = await model.find({
//       $expr: {
//         $or: [
//           { $eq: [{ $month: "$warrantyData.insurance.endDate" }, currentMonth] },
//           { $eq: [{ $month: "$warrantyData.Puc.endDate" }, currentMonth] },
//           { $eq: [{ $month: "$warrantyData.services.lastServiceDate" }, currentMonth] },
//         ],
//       },
//     }).lean();
//     const fEvents = events.map(event => {
//       let changedValues = {};
//       if (new Date(event.warrantyData.insurance.endDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
//         changedValues[`reason`] = 'Insurance will expire soon';
//         changedValues['date'] = event.warrantyData.insurance.endDate
//       } else if (new Date(event.warrantyData.Puc.endDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
//         changedValues[`reason`] = 'Puc will expire soon';
//         changedValues['date'] = event.warrantyData.Puc.endDate
//       } else if (new Date(event.warrantyData.services.lastServiceDate).getMonth()+1 === new Date(currentDate.getTime()).getMonth()+1) {
//         changedValues[`reason`] = 'Service will expire soon';
//         changedValues['date'] = event.warrantyData.services.lastServiceDate
//       }
//       return { ...event, ...changedValues  };
//     })
    
//     const formattedEvents = fEvents.map(event => {
//       return ({id: event._id, title: event.title || event.name, date: event.date, reason: event.reason})
//     })
//     return formattedEvents;
//   } catch (error) {
//     console.error(`Error retrieving events for ${model.modelName}:`, error);
//     return [];
//   }
// };

// const test = async () => {
//   const allEvents = await getAllEvents()
//   console.log(allEvents)
// }

// test()


// runningTheCronEvery()

module.exports = app
