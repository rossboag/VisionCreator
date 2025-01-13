module.exports = {
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
  database: {
    url: process.env.DATABASE_URL,
    connectionLimit: 10,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  logging: {
    level: 'info',
    format: 'json',
  },
  security: {
    corsOrigins: ['https://visioncreator.com'],
    rateLimitRequests: 100,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  },
}

