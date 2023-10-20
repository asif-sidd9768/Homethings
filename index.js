require('dotenv').config()
const app = require('./app')
const http = require('http')
const sendBirthdayNotifications = require('./controllers/activeUser')

const server = http.createServer(app)
server.listen(process.env.PORT, (PORT) => {
  sendBirthdayNotifications()
  console.log(`Server running on port ${process.env.PORT}`)
})