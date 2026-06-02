const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management System API',
      version: '1.0.0',
      description: 'Production-ready Node.js & Express API for Full-Stack Product Management System',
      contact: {
        name: 'Backend Developer',
        email: 'developer@system.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token in the format: Bearer <token>'
        }
      },
      schemas: {
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password', 'confirmPassword'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'SecurePass123!' },
            confirmPassword: { type: 'string', format: 'password', example: 'SecurePass123!' }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'SecurePass123!' }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock', 'category'],
          properties: {
            name: { type: 'string', example: 'Gaming Laptop X15' },
            description: { type: 'string', example: 'High performance gaming laptop with RTX 4070' },
            price: { type: 'number', example: 1499.99 },
            stock: { type: 'integer', example: 25 },
            category: { type: 'string', example: 'Electronics' },
            image: { type: 'string', example: '/uploads/image.png' }
          }
        },
        ProductResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'Gaming Laptop X15' },
            description: { type: 'string', example: 'High performance gaming laptop' },
            image: { type: 'string', example: '/uploads/image.png' },
            price: { type: 'number', example: 1499.99 },
            stock: { type: 'integer', example: 25 },
            category: { type: 'string', example: 'Electronics' },
            createdBy: { type: 'string', example: '60d0fe4f5311236168a109c9' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Please enter a valid email address' }
                }
              }
            }
          }
        }
      }
    },
    paths: {
      '/api/v1/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserRegister' }
              }
            }
          },
          responses: {
            201: {
              description: 'Registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      accessToken: { type: 'string', example: 'eyJhbGci...' },
                      refreshToken: { type: 'string', example: 'eyJhbGci...' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: '60d0fe4f5311236168a109c9' },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          role: { type: 'string', example: 'user' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid input or user already exists',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        }
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Login existing user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserLogin' }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      accessToken: { type: 'string', example: 'eyJhbGci...' },
                      refreshToken: { type: 'string', example: 'eyJhbGci...' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: '60d0fe4f5311236168a109c9' },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          role: { type: 'string', example: 'user' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'Unauthorized / Invalid credentials' }
          }
        }
      },
      '/api/v1/auth/profile': {
        get: {
          summary: 'Get current user profile',
          tags: ['Authentication'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Successful retrieval',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: '60d0fe4f5311236168a109c9' },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          role: { type: 'string', example: 'user' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'No token or expired token' }
          }
        }
      },
      '/api/v1/auth/refresh': {
        post: {
          summary: 'Refresh Access Token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string', example: 'eyJhbGci...' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Token refreshed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      accessToken: { type: 'string', example: 'eyJhbGci...' },
                      refreshToken: { type: 'string', example: 'eyJhbGci...' }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid refresh token' }
          }
        }
      },
      '/api/v1/products': {
        get: {
          summary: 'Get all products',
          description: 'Fetch products list with pagination, search, sort, and filters.',
          tags: ['Products'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price', '-price', 'name', '-name', 'oldest', '-createdAt'] } },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'stockStatus', in: 'query', schema: { type: 'string', enum: ['inStock', 'outOfStock'] } }
          ],
          responses: {
            200: {
              description: 'Successful products fetching',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 1 },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          pages: { type: 'integer' }
                        }
                      },
                      products: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ProductResponse' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new product',
          description: 'Requires admin authorization.',
          tags: ['Products'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Product created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Product created successfully' },
                      product: { $ref: '#/components/schemas/ProductResponse' }
                    }
                  }
                }
              }
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (Requires Admin)' }
          }
        }
      },
      '/api/v1/products/{id}': {
        get: {
          summary: 'Get product by ID',
          tags: ['Products'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: {
              description: 'Product found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductResponse' } } }
            },
            404: { description: 'Product not found' }
          }
        },
        put: {
          summary: 'Update existing product',
          description: 'Requires admin authorization.',
          tags: ['Products'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductInput' }
              }
            }
          },
          responses: {
            200: { description: 'Product updated successfully' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Product not found' }
          }
        },
        delete: {
          summary: 'Delete product',
          description: 'Requires admin authorization.',
          tags: ['Products'],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Product deleted' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Product not found' }
          }
        }
      },
      '/api/v1/products/dashboard/analytics': {
        get: {
          summary: 'Get dashboard analytics stats',
          description: 'Allows logged in users to fetch summary stats.',
          tags: ['Dashboard'],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Dashboard stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      analytics: {
                        type: 'object',
                        properties: {
                          totalProducts: { type: 'integer', example: 100 },
                          activeProducts: { type: 'integer', example: 92 },
                          outOfStockProducts: { type: 'integer', example: 8 },
                          totalInventoryValue: { type: 'number', example: 250000.5 },
                          categoryBreakdown: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                category: { type: 'string', example: 'Electronics' },
                                count: { type: 'integer', example: 45 }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/products/upload': {
        post: {
          summary: 'Upload product image',
          description: 'Requires admin authorization. Accepts multipart/form-data with an file named "image".',
          tags: ['Products'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    image: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Image uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      imageUrl: { type: 'string', example: '/uploads/image-16235672923.png' }
                    }
                  }
                }
              }
            },
            400: { description: 'No file or invalid file type' }
          }
        }
      }
    }
  },
  apis: [] // No files scanned since documentation is explicitly declared in schema
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
