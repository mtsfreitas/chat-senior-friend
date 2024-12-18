require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const OpenAI = require('openai');

// Configure CORS
fastify.register(cors, {
  origin: true, // This allows all origins, you can restrict this in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Add a JSON body parser
fastify.register(require('@fastify/formbody'));

fastify.post('/analyze-code', async (req, reply) => {
  const { code } = req.body;

  if (!code) {
    return reply.code(400).send({ error: 'Code snippet is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for analyzing and improving code.' },
        { role: 'user', content: `Analyze and refactor this code:\n${code}` },
      ],
    });

    const explanation = response.choices[0].message.content;

    reply.send({ explanation });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Failed to process request' });
  }
});

// Inicia o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Backend is running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();