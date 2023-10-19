const activeUserRouter = require('express').Router()
const ActiveUser = require('../models/activeUser')
const {Expo} = require('expo-server-sdk')

const schedule = require('node-schedule');

// Function to send birthday notifications
const sendBirthdayNotifications = async () => {
  console.log("SCHEDULED THE JOB")
  const currentDate = new Date();

  // Find active users whose birthday is today
  const activeUsers = await ActiveUser.find({
    birthday: {
      $gte: currentDate,
      $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // Check for birthdays in the next 24 hours
    }
  });

  if (activeUsers.length === 0) {
    console.log("No birthdays today");
    return;
  }

  let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  let messages = [];
  for (let activeUser of activeUsers) {
    // Construct a message
    messages.push({
      to: activeUser.deviceToken,
      sound: 'default',
      body: `Happy Birthday, ${activeUser.name}! 🎉`,
      data: { birthdayNotification: true },
    });
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

// Schedule the job to run daily at a specific time (e.g., midnight)

activeUserRouter.get("/", async (req, res) => {
  const job = schedule.scheduleJob('0 0 * * *', sendBirthdayNotifications);
  res.send("Server is ready to send birthday notifications.");
});

activeUserRouter.post("/", async (req, res) => {
  const { name, username, deviceToken, birthday } = req.body;

  const activeUser = new ActiveUser({
    name,
    username,
    deviceToken,
    birthday: new Date(birthday), // Convert birthday to a Date object
  });

  console.log('active user == ', activeUser);

  await activeUser.save();
  res.send(activeUser);
});

module.exports = activeUserRouter;

// activeUserRouter.get("/", async(req, res) => {
//   const activeUsers = await ActiveUser.find({}) 
  
//   let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
//   let messages = [];
//   for (let activeUser of activeUsers) {
//     // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
//     messages.push({
//       to: activeUser.deviceToken,
//       sound: 'default',
//       body: 'Someone\'s missing u',
//       data: { withSome: 'data' },
//     })
//   }
//   let chunks = expo.chunkPushNotifications(messages);
//   let tickets = [];
//   (async () => {
//     for (let chunk of chunks) {
//       try {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         console.log(ticketChunk);
//         tickets.push(...ticketChunk);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   })();

//   res.send(activeUsers)
// })

// activeUserRouter.post("/", async(req, res) => {
//   const { name, username, deviceToken } = req.body
//   const activeUser = new ActiveUser({
//     name,
//     username,
//     deviceToken
//   })
//   console.log('active user == ', activeUser)
//   await activeUser.save()
//   res.send(activeUser)
// })

// module.exports = activeUserRouter