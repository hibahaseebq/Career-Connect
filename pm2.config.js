module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend/server.js', // Adjust the path to your backend server file
      watch: ['./backend'], // Watch for changes in the backend directory
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend', // Adjust the path to your frontend directory
      watch: ['./frontend/src'],
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
  