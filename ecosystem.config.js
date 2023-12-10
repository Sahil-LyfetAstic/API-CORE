/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json');

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
