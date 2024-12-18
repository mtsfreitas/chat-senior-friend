const fastify = require('fastify')({ logger: true });
const config = require('./config/environment');
const configureCors = require('./plugins/cors');
const analyzerRoutes = require('./routes/analyzer.routes');

class App {
  constructor() {
    this.fastify = fastify;
  }

  async setup() {
    // Register plugins
    await configureCors(this.fastify);
    await this.fastify.register(require('@fastify/formbody'));

    // Register routes
    await this.fastify.register(analyzerRoutes);
  }

  async start() {
    try {
      await this.setup();
      await this.fastify.listen({ 
        port: config.port, 
        host: config.host 
      });
      console.log(`Backend is running on http://localhost:${config.port}`);
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

module.exports = new App();