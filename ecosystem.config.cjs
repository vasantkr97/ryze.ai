module.exports = {
  apps: [
    {
      name: 'ryze-api',
      script: 'apps/api/dist/index.js', // Path to the built server entry point
      interpreter: 'bun', // Explicitly use Bun interpreter
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      // Watch is usually disabled in production to prevent accidental restarts on log writes
      watch: false,
      instances: 1,
      exec_mode: 'fork', // Bun doesn't support Node's 'cluster' mode the same way yet, so fork is safer
    },
  ],
};
