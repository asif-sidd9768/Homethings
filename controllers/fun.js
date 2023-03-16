const funRouter = require('express').Router()
const {generate} = require('../utils/openai-connector')
const {generateQuestion} = require('../utils/openai-connector')

funRouter.post('/', async (req, res) => {
  const { data } = req.body
  console.log(data)
  const response = await generate(data)
  res.send(response)
})

funRouter.post('/question', async(req, res) => {
  const { data, questions } = req.body
  console.log('====================================');
  console.log('data==== ', data);
  console.log('questions === ', questions)
  console.log('====================================');
  const questionsArray = Object.values(questions).filter(v => v != "").map(v => v.trim())
  let question;
  if(questions && Object.keys(questions).length !== 0){
    question = `generate a ${data} question (asked new questions), and question should not be from the following questions: [ ${questionsArray} ]`
  }else{
    question = `generate a ${data} question (asked new questions)`
  }
  
  const response = await generateQuestion(question)
  res.send(response)
})

funRouter.post('/answer', async(req, res) => {
  const { question, answer } = req.body
  const sentence = `Analyze the below answer for question "${question}":\n
  ${answer} \n\n
  Mark out of 10: answer should be in a format = (1. mark out of 10 and in the next line 2. reasoning)`
  console.log(sentence)
  const response = await generateQuestion(sentence)
  res.send(response)
})

module.exports = funRouter