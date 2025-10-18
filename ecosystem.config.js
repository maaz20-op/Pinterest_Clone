module.exports = {
  apps: [
    {
      name: 'reelnest-3001',
      script: 'app.js',
      env: { PORT: 3001 }
    },
    {
      name: 'reelnest-3002',
      script: 'app.js',
      env: { PORT: 3002 }
    },
    {
      name: 'reelnest-3003',
      script: 'app.js',
      env: { PORT: 3003 }
    }
  ]
};