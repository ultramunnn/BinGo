export const schemas = {
  Classification: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      image_url: { type: 'string' },
      waste_type: { type: 'string', example: 'plastic' },
      confidence: { type: 'number', example: 0.95 },
      cv_confidence: { type: 'number', example: 0.95, description: 'Raw CV model confidence before calibration' },
      latitude: { type: 'number', example: -6.9175 },
      longitude: { type: 'number', example: 107.6191 },
      location_name: { type: 'string', nullable: true },
      recyclable: { type: 'string', example: 'Yes' },
      treatment: { type: 'string', example: 'Recycle' },
      recyclable_confidence: { type: 'number', example: 0.92 },
      treatment_confidence: { type: 'number', example: 0.87 },
      created_at: { type: 'string', format: 'date-time' },
    },
  },

  ScanResult: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/Classification' },
    },
  },

  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      full_name: { type: 'string', nullable: true, example: 'John Doe' },
      photo_url: { type: 'string', nullable: true, example: 'https://supabase.co/storage/v1/object/public/avatars/user-123.jpg' },
      created_at: { type: 'string', format: 'date-time' },
    },
  },
  
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'Invalid email or password' },
    },
  },
  
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Operation successful' },
    },
  },
  
  AuthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Login successful' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      user: { $ref: '#/components/schemas/User' },
    },
  },
};