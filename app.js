const express = require('express')
const cors = require('cors')
const app = express()
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
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

module.exports = app
