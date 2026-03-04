# Process Managers

## PM2 (Node.js)

### Basic Usage
```bash
# Install globally
npm install -g pm2

# Start application
pm2 start dist/index.js --name "api"

# Cluster mode (all CPUs)
pm2 start dist/index.js -i max --name "api"

# Common commands
pm2 list              # List processes
pm2 logs api          # View logs
pm2 restart api       # Restart
pm2 stop api          # Stop
pm2 delete api        # Remove
pm2 monit             # Monitor dashboard
```

### Ecosystem File
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

// Usage: pm2 start ecosystem.config.js --env production
```

### Startup & Deploy
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Deploy (with ecosystem deploy config)
pm2 deploy production setup
pm2 deploy production
```

## systemd (Linux)

### Service File
```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Commands
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable myapp

# Start/Stop/Restart
sudo systemctl start myapp
sudo systemctl stop myapp
sudo systemctl restart myapp

# Check status
sudo systemctl status myapp

# View logs
sudo journalctl -u myapp -f
```

## Supervisor (Python)

```ini
# /etc/supervisor/conf.d/myapp.conf
[program:myapp]
command=/app/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
directory=/app
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/myapp.err.log
stdout_logfile=/var/log/myapp.out.log
environment=PYTHONPATH="/app"
```

## Comparison

| Feature | PM2 | systemd | Supervisor |
|---------|-----|---------|------------|
| Clustering | ✅ Built-in | Manual | Manual |
| Log management | ✅ Built-in | journald | File-based |
| Monitoring | ✅ Dashboard | Basic | Web UI |
| Zero-downtime | ✅ reload | Restart | Restart |
| Best for | Node.js | Any Linux | Python |
