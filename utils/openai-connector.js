const generate = async (input) => {
  try{
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

module.exports = generate