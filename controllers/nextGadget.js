const nGRouter = require('express').Router()
const axios = require('axios')

nGRouter.get('/', async (req, res) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=4`;
  // Fetch latest videos from YouTube channel
  const response = await axios.get(API_URL)
  res.send(response.data)
})

module.exports = nGRouter