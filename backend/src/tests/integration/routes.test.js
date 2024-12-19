const fastify = require('fastify');
const nock = require('nock');
const routes = require('../../routes/analyzer.routes'); // Corrigido

describe('Routes', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    app.register(routes);  // Registra as rotas no app Fastify
  });

  afterAll(async () => {
    await app.close();  // Fecha o servidor Fastify após os testes
  });

  it('should return 200 when valid code is sent', async () => {
    const code = 'console.log("Hello, World!");';

    // Simula a resposta da API da OpenAI
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
