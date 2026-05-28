export const classificationDocs = {
  paths: {
    '/api/scans/questionnaire': {
      get: {
        summary: 'Get questionnaire for material category',
        description: 'Returns dynamic questionnaire fields based on the detected waste material category. Used by frontend to render category-specific form inputs before scanning.',
        tags: ['Waste Classification'],
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: true,
            schema: { type: 'string', enum: ['plastic', 'paper', 'glass', 'metal', 'textile'] },
            description: 'Waste material category',
          },
        ],
        responses: {
          200: {
            description: 'Questionnaire fields for the category',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        category: { type: 'string' },
                        questions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              field: { type: 'string' },
                              label: { type: 'string' },
                              type: { type: 'string' },
                              options: { type: 'array', items: { type: 'string' } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Missing category parameter' },
          502: { description: 'AI service unavailable' },
        },
      },
    },
    '/api/scans': {
      post: {
        summary: 'Scan beach waste',
        description: 'Upload an image of beach waste with GPS coordinates. The backend classifies the waste via AI and returns recyclability prediction.',
        tags: ['Waste Classification'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['photo', 'latitude', 'longitude'],
                properties: {
                  photo: { type: 'string', format: 'binary', description: 'Image of beach waste' },
                  latitude: { type: 'number', example: -6.9175 },
                  longitude: { type: 'number', example: 107.6191 },
                  location_name: { type: 'string', example: 'Pangandaran Beach' },
                  is_hard: { type: 'boolean', description: 'Is the waste hard? (PLASTIC only)' },
                  is_multilayer: { type: 'boolean', description: 'Is the waste multi-layer? (PLASTIC only)' },
                  is_dry: { type: 'boolean', description: 'Is the waste dry? (PLASTIC, PAPER, TEXTILE)' },
                  is_clean: { type: 'boolean', description: 'Is the waste clean? (all categories)' },
                  is_container: { type: 'boolean', description: 'Is the waste a container? (PLASTIC, METAL, GLASS)' },
                  is_fragment: { type: 'boolean', description: 'Is the waste a fragment? (PAPER, METAL, GLASS, TEXTILE)' },
                  is_hazardous: { type: 'boolean', description: 'Is the waste hazardous? (PLASTIC, METAL, TEXTILE)' },
                  is_foam: { type: 'boolean', description: 'Is the waste foam? (PLASTIC only)' },
                  is_small_item: { type: 'boolean', description: 'Is the waste a small item? (PLASTIC, METAL, GLASS)' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Scan completed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ScanResult' },
              },
            },
          },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          422: { description: 'Questionnaire incomplete — required fields missing for detected category', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          502: { description: 'AI service unavailable', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      get: {
        summary: 'Get all scans',
        description: 'Retrieve all scan results (public feed) with pagination.',
        tags: ['Waste Classification'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'List of scans',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Classification' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/scans/me': {
      get: {
        summary: 'Get my scans',
        description: 'Retrieve the authenticated user\'s scan history with pagination.',
        tags: ['Waste Classification'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'User scan history' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/scans/{id}': {
      get: {
        summary: 'Get scan by ID',
        description: 'Retrieve a single scan result by its ID.',
        tags: ['Waste Classification'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Scan details' },
          404: { description: 'Scan not found' },
        },
      },
      delete: {
        summary: 'Delete scan',
        description: 'Delete a scan. Users can only delete their own scans.',
        tags: ['Waste Classification'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Scan deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Scan not found or not authorized' },
        },
      },
    },
  },
};