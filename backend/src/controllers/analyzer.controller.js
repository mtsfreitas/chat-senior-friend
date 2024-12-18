const openaiService = require('../services/openai.service');

class AnalyzerController {
  async analyzeCode(req, reply) {
    const { code } = req.body;

    if (!code) {
      return reply.code(400).send({ error: 'Code snippet is required' });
    }

    try {
      const analysisResult = await openaiService.analyzeCode(code);

      return reply.send({
        naturalLanguageExplanation: analysisResult.naturalLanguageExplanation || 'No explanation available',
        refactoredCode: analysisResult.refactoredCode || 'No refactored code available',
        stepByStepReasoning: analysisResult.stepByStepReasoning || 'No reasoning available'
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error.response) {
        console.error('OpenAI Error Response:', error.response.data);
      }
      
      return reply.code(500).send({ 
        error: 'Failed to process request', 
        details: error.message 
      });
    }
  }
}

module.exports = new AnalyzerController();