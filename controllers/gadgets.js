const gadgetsRouter = require('express').Router()
const Gadget = require('../models/gadget')
const User = require('../models/user')

gadgetsRouter.get('/', async (req, res) => {
  const gadgets = await Gadget
    .find({})
  res.send(gadgets)
})

gadgetsRouter.post('/', async (req, res) => {
  const { type, name, warranty, warrantyTill } = req.body
  const gadget = new Gadget({
    type,
    name,
    warranty,
    warrantyTill
  })
  const user = await User.findById()
  user.gadgets.push(gadget)
  gadget.save()
  user.save()
  // console.log('gadget == ', gadget)
  // console.log('user=== ', user)
  // console.log(type, name, warranty, warrantyTill)
  res.status(201).json(user)
  // res.send('done')
})

module.exports = gadgetsRouter