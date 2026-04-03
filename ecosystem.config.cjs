const path = require('path');
const serverDir = path.resolve(__dirname, 'server');

module.exports = {
  apps: [{
    name: 'pmhnp-prep',
    cwd: serverDir,
    script: 'src/index.js',
    node_args: `--env-file=${path.join(serverDir, '.env')}`,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: path.resolve(__dirname, 'logs/error.log'),
    out_file: path.resolve(__dirname, 'logs/output.log'),
    merge_logs: true
  }]
};
