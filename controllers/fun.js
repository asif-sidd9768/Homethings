const funRouter = require('express').Router()
const generate = require('../utils/openai-connector')

funRouter.post('/', async (req, res) => {
  const { data } = req.body
  const response = await generate(data)
  res.send(response)
})

module.exports = funRouter