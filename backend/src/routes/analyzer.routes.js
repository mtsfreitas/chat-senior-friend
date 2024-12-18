const analyzerController = require('../controllers/analyzer.controller');

async function routes(fastify) {
  fastify.post('/analyze-code', analyzerController.analyzeCode);
}

module.exports = routes;