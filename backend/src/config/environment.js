require('dotenv').config();

const config = {
  port: 3001,
  host: '0.0.0.0',
  openaiApiKey: process.env.OPENAI_API_KEY,
};

module.exports = config;