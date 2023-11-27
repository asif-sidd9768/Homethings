const activeUserRouter = require('express').Router()
const ActiveUser = require('../models/activeUser')
const {Expo} = require('expo-server-sdk')
const cron = require('node-cron');
const User = require('../models/user');

// const schedule = require('node-schedule');

// // Function to send birthday notifications
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
      data: { withSome: 'data' },
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

const runningTheCronEvery = () => {
  cron.schedule('*/20 * * * * *', () => {
    sendBirthdayNotifications()
    console.log('running a task every minute');
  });
}

async function getUsersWithBirthdayInCurrentMonth() {
  try {
    // Get the current month (1-indexed)
    const currentMonth = new Date().getMonth() + 1;

    // Query the database using Mongoose
    const usersInMonth = await User.find({
      $expr: {
        $eq: [{ $month: '$birthDay' }, 12],
      },
    });

    return usersInMonth;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}


activeUserRouter.get("/", async(req, res) => {

  const usersB = await getUsersWithBirthdayInCurrentMonth()
  // if(usersB.length > 1){
  //   return res.status(200).json({data: usersB.count})
  // }
  // console.log(usersB)
  // res.send(usersB)
  cron.schedule('*/20 * * * * *', () => {
    sendBirthdayNotifications(`${usersB.length} people have birthday this month`)
    console.log('running a task every minute');
  });
})

activeUserRouter.post("/", async(req, res) => {
  const { name, username, deviceToken } = req.body
  const activeUser = new ActiveUser({
    name,
    username,
    deviceToken
  })
  console.log('active user == ', activeUser)
  await activeUser.save()
  res.send(activeUser)
})

activeUserRouter.post("/remove", async (req, res) => {
  const {deviceToken} = req.body
  try{
    const foundToken = await ActiveUser.findOneAndDelete({deviceToken})
    res.send({"Successfull": foundToken})
  }catch(error){
    res.send({error:"No success"})
  }
})

activeUserRouter.post("/logout", async (req, res) => {
  const { name, username, deviceToken } = req.body
  res.send("Got it=== ", name, username, deviceToken)
}) 

module.exports = activeUserRouter