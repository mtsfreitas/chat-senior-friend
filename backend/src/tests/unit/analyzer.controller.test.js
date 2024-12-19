const AnalyzerController = require('../../controllers/analyzer.controller');
const OpenAIService = require('../../services/openai.service');

jest.mock('../../services/openai.service');  // Mock para o serviço

describe('AnalyzerController', () => {
  it('should return analysis when code is provided', async () => {
    const req = { body: { code: 'console.log("Hello, World!");' } };
    const reply = { send: jest.fn() };

    OpenAIService.analyzeCode.mockResolvedValue({
      naturalLanguageExplanation: 'Explanation here',
      refactoredCode: 'Refactored code',
      stepByStepReasoning: 'Step-by-step reasoning'
    });

    await AnalyzerController.analyzeCode(req, reply);

    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      naturalLanguageExplanation: expect.any(String),
      refactoredCode: expect.any(String),
      stepByStepReasoning: expect.any(String),
    }));
  });

  it('should return 400 if no code is provided', async () => {
    const req = { body: {} };
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

    await AnalyzerController.analyzeCode(req, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Code snippet is required' });
  });
});
