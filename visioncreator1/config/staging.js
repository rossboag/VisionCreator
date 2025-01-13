module.exports = {
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
  database: {
    url: process.env.STAGING_DATABASE_URL,
    connectionLimit: 5,
  },
  redis: {
    url: process.env.STAGING_REDIS_URL,
  },
  logging: {
    level: 'debug',
    format: 'json',
  },
  security: {
    corsOrigins: ['https://staging.visioncreator.com'],
    rateLimitRequests: 200,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  },
}

