const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('gadgets')
  res.json(users)
})

// usersRouter.post('/bDay', async (req, res) => {
//   const { birthday } = req.body
//   user.birthDay = birthday
//   user.save()
//   res.status(201).json(user)
// })

usersRouter.post('/', async (req, res) => {
  const { username, name, password, birthDay } = req.body

  const existingUser = await User.findOne({ username })
  if(existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    birthDay,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter