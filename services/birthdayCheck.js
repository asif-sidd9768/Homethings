const {Expo} = require('expo-server-sdk')

const ActiveUser = require("../models/activeUser");
const User = require("../models/user");

const getUsersWithBirthdayInCurrentMonth = async () => {
  try {
    // Get the current month (1-indexed)
    const currentMonth = new Date().getMonth() + 1;
    // Query the database using Mongoose
    const usersInMonth = await User.find({
      $expr: {
        $eq: [{ $month: '$birthDay' }, currentMonth],
      },
    });

    return usersInMonth;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

const getUsersWithBirthdayTomorrow = async () => {
  try {
    // Get the current date
    const currentDate = new Date("12/30/2023");

    // Get tomorrow's date
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    // Extract tomorrow's month and day
    const tomorrowMonth = tomorrow.getMonth() + 1; // Month is 0-indexed
    const tomorrowDay = tomorrow.getDate();
    // Query the database using Mongoose
    const usersTomorrow = await User.find({
      $expr: {
        $or: [
          {
            $and: [
              { $eq: [{ $month: '$birthDay' }, tomorrowMonth] },
              { $eq: [{ $dayOfMonth: '$birthDay' }, tomorrowDay-1] },
            ],
          },
        ],
      },
    })

    return usersTomorrow;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};


const sendBirthdayNotifications = async (title, body) => {
  console.log("SCHEDULED THE JOB")
  // const currentDate = new Date();

  // Find active users whose birthday is today
  const activeUsers = await ActiveUser.find({}) 
  let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  let messages = [];
  for (let activeUser of activeUsers) {
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: activeUser.deviceToken,
      sound: 'default',
      body,
      title,
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

module.exports = {getUsersWithBirthdayInCurrentMonth, sendBirthdayNotifications, getUsersWithBirthdayTomorrow}