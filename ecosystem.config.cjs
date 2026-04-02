module.exports = {
  apps: [{
    name: 'pmhnp-prep',
    cwd: './server',
    script: 'src/index.js',
    node_args: '--env-file=.env',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true
  }]
};
