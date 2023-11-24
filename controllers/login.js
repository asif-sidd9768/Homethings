const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const ActiveUser = require('../models/activeUser')

loginRouter.get('/', async(req, res) => {
  const users = await User.find({})
  res.send(users)
})

loginRouter.post('/', async(req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if(!(user && passwordCorrect)){
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
  const activeUser = new ActiveUser({
    username,
    deviceToken,
    isActive: true
  })
  console.log(activeUser)
  res
    .status(200)
    .send({ token, username: user.username, name: user.name })

})

loginRouter.post('/change-password', async (req, res) => {
  const {username, password, newPassword} = req.body
  const user = await User.findOne({username})
  const saltRounds = 10
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)
  user.passwordHash = newPasswordHash
  await user.save()
  res.send("Password Successfully changed")
})

module.exports = loginRouter