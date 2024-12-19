const fastify = require('fastify');
const nock = require('nock');
const routes = require('../../routes/analyzer.routes'); 

describe('Routes', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    app.register(routes); 
  });

  afterAll(async () => {
    await app.close(); 
  });

  it('should return 200 when valid code is sent', async () => {
    const code = 'console.log("Hello, World!");';

    nock('https://api.openai.com')
      .post('/v1/chat/completions')
      .reply(200, {
        choices: [
          {
            message: {
              content: JSON.stringify({
                naturalLanguageExplanation: 'Prints "Hello, World!" to the console.',
                refactoredCode: 'console.log("Hi, World!");',
                stepByStepReasoning: '1. Analyzed...'
              }),
            },
          },
        ],
      });

    const response = await app.inject({
      method: 'POST',
      url: '/analyze-code',
      payload: { code },
    });

    expect(response.statusCode).toBe(200);
  });

  it('should return 400 if no code is sent', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/analyze-code',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });
});
