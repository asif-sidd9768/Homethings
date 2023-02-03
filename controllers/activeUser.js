const activeUserRouter = require('express').Router()
const ActiveUser = require('../models/activeUser')

activeUserRouter.post("/", async(req, res) => {
  const { name, username, deviceToken } = req.body
  const activeUser = new ActiveUser({
    name,
    username,
    deviceToken
  })
  console.log('active user == ', activeUser)
  activeUser.save()
  res.send(activeUser)
})

module.exports = activeUserRouter