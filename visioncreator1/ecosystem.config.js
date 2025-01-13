module.exports = {
  apps: [
    {
      name: 'visioncreator-production',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
    {
      name: 'visioncreator-staging',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
}

