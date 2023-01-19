const nGRouter = require('express').Router()

nGRouter.get('/', async (req, res) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY}&channelId=${process.env.CHANNEL_ID}&part=snippet,id&order=date&maxResults=4`;
  // Fetch latest videos from YouTube channel
  const response = await fetch(API_URL)
  const data = await response.json()
  res.send(data)
})

module.exports = nGRouter