export const authDocs = {
  // Paths
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Registrasi user baru',
        description: 'Membuat akun baru dengan role user (default)',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 6, example: 'password123' },
                  full_name: { type: 'string', example: 'John Doe' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Registrasi berhasil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Validasi gagal',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Email sudah terdaftar',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Email already registered' },
              },
            },
          },
        },
      },
    },
    
    '/api/auth/login': {
      post: {
        summary: 'Login pengguna',
        description: 'Autentikasi dan mendapatkan JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login berhasil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Invalid email or password' },
              },
            },
          },
        },
      },
    },
    
    '/api/auth/reset-password': {
      post: {
        summary: 'Request reset password',
        description: 'Mengirim link reset password ke email',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Reset link terkirim',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  message: 'If email exists, reset link will be sent to your inbox',
                },
              },
            },
          },
        },
      },
    },
    
    '/api/auth/change-password': {
      post: {
        summary: 'Mengubah password dengan reset token',
        description: 'Menyelesaikan proses reset password',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'new_password'],
                properties: {
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  new_password: { type: 'string', minLength: 6, example: 'newpassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password berhasil diubah',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: { success: true, message: 'Password changed successfully' },
              },
            },
          },
          400: {
            description: 'Token invalid',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Invalid or expired token' },
              },
            },
          },
        },
      },
    },
    
    '/api/auth/logout': {
      post: {
        summary: 'Logout pengguna',
        description: 'Menonaktifkan token JWT',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logout berhasil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: { success: true, message: 'Logout successful' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    
    '/api/auth/me': {
      get: {
        summary: 'Mendapatkan profil user saat ini',
        description: 'Mengambil data user berdasarkan token JWT',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profil user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};