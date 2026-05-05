export const schemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      full_name: { type: 'string', nullable: true, example: 'John Doe' },
      role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
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