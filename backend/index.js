require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const OpenAI = require('openai');

// Configure CORS
fastify.register(cors, {
  origin: true,
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
        { 
          role: 'system', 
          content: `You are an expert code analyst. For any code provided, generate a comprehensive analysis. 
          Provide clear, detailed responses for:
          1. Natural Language Explanation: A comprehensive description of what the code does
          2. Refactored Code: An improved version of the code with comments explaining the improvements
          3. Step-by-Step Reasoning: Detailed explanation of how you analyzed the code

          Format your response as a JSON object with these three keys:
          - naturalLanguageExplanation: string
          - refactoredCode: string
          - stepByStepReasoning: string

          IMPORTANT: Ensure each section is populated with meaningful content.`
        },
        { 
          role: 'user', 
          content: `Analyze this code:\n${code}` 
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    // Log the full response for debugging
    console.log('OpenAI Response:', response.choices[0].message.content);

    // Parse the JSON response
    const analysisResult = JSON.parse(response.choices[0].message.content);

    // Send the comprehensive analysis
    reply.send({
      naturalLanguageExplanation: analysisResult.naturalLanguageExplanation || 'No explanation available',
      refactoredCode: analysisResult.refactoredCode || 'No refactored code available',
      stepByStepReasoning: analysisResult.stepByStepReasoning || 'No reasoning available'
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('OpenAI Error Response:', error.response.data);
    }
    
    reply.code(500).send({ 
      error: 'Failed to process request', 
      details: error.message 
    });
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