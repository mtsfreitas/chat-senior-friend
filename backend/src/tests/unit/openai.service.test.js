const OpenAIService = require('../../services/openai.service');
const nock = require('nock');

describe('OpenAIService', () => {
  it('should return analysis result', async () => {
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
                stepByStepReasoning: '1. Analyzed the code...'
              }),
            },
          },
        ],
      });

    const result = await OpenAIService.analyzeCode(code);

    expect(result).toHaveProperty('naturalLanguageExplanation');
    expect(result).toHaveProperty('refactoredCode');
    expect(result).toHaveProperty('stepByStepReasoning');
  });
});
