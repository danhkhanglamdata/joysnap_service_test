# VPS & Self-Hosted Deployment

## VPS Providers

| Provider | Starting Price | Best For |
|----------|---------------|----------|
| DigitalOcean | $4/mo | Simple, good docs |
| Linode | $5/mo | Performance |
| Vultr | $2.50/mo | Budget |
| Hetzner | €3.79/mo | Europe, value |
| Contabo | €4.99/mo | High specs/price |

## Initial Server Setup

### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy

# SSH key setup
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# Add your public key to ~/.ssh/authorized_keys

# Disable password auth
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Install Docker
```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Nginx Reverse Proxy

### Basic Config
```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL with Certbot

```bash
# Install
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d myapp.com -d www.myapp.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

## Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

APP_DIR=/var/www/myapp
REPO=git@github.com:user/myapp.git

# Pull latest
cd $APP_DIR
git pull origin main

# Build and restart
docker-compose build
docker-compose up -d

# Cleanup
docker image prune -f

echo "Deployed successfully!"
```

## GitHub Actions to VPS

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/myapp
            git pull origin main
            docker-compose up -d --build
```

## Monitoring

### Basic Health Check
```bash
# healthcheck.sh (run via cron)
#!/bin/bash
if ! curl -sf http://localhost:3000/health > /dev/null; then
    docker-compose restart app
    echo "App restarted at $(date)" >> /var/log/healthcheck.log
fi
```

### Cron Setup
```bash
# Check every 5 minutes
*/5 * * * * /var/www/myapp/healthcheck.sh
```
