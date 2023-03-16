const activeUserRouter = require('express').Router()
const ActiveUser = require('../models/activeUser')
const {Expo} = require('expo-server-sdk')

activeUserRouter.get("/", async(req, res) => {
  const activeUsers = await ActiveUser.find({}) 
  
  let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  let messages = [];
  for (let activeUser of activeUsers) {
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: activeUser.deviceToken,
      sound: 'default',
      body: 'Someone\'s missing u',
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

  res.send(activeUsers)
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

module.exports = activeUserRouter