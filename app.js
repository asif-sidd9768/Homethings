const express = require('express')
const cors = require('cors')
const app = express()
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.connect(url)
.then(() => {
  console.log('CONEECTED')
})
.catch((error) => {
  console.log('error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello')
})
app.use('/api/login', loginRouter)

module.exports = app
