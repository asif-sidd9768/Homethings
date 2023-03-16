const generate = async (input) => {
  try{
    console.log(input)
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: input,
    temperature: 0.4,
    max_tokens: 1024
    });
    return response.data.choices[0].text
  }catch(e){
    console.log(e)
  }
}

const generateQuestion = async (input) => {
  try{
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: input,
    temperature: 0,
    max_tokens: 1601,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    });
    return response.data.choices[0].text
  }catch(e){
    console.log(e)
  }
}

exports.generate = generate
exports.generateQuestion = generateQuestion