import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { docs } from '../docs';

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(docs, {
      // explorer: true,
      customSiteTitle: 'BinGo API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    })
  );

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(docs);
  });

};