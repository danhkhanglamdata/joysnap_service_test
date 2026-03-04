# Netlify Domains & HTTPS

## Custom Domains Overview

Netlify supports custom domains for:
- Production sites
- Deploy previews
- Branch deploys

## Adding a Custom Domain

### Via Netlify UI

1. Go to **Site settings** > **Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

### Via CLI

```bash
# Add domain to site
netlify domains:add example.com

# List domains
netlify domains:list
```

## DNS Configuration Options

### Option 1: Netlify DNS (Recommended)

Delegate your domain to Netlify's nameservers for automatic configuration.

**Nameservers:**
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

**Benefits:**
- Automatic SSL certificate provisioning
- Automatic DNS record management
- Branch subdomains support
- Faster propagation

### Option 2: External DNS

Point your domain to Netlify using your existing DNS provider.

**For Apex Domain (example.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For Subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

**For Apex with ALIAS/ANAME (if supported):**
```
Type: ALIAS or ANAME
Name: @
Value: [your-site-name].netlify.app
```

## DNS Records Management

### Adding DNS Records (Netlify DNS)

```bash
# Via UI: Domain settings > DNS records > Add new record

# Common record types:
# A     - IPv4 address
# AAAA  - IPv6 address
# CNAME - Canonical name
# MX    - Mail exchange
# TXT   - Text record
# NS    - Nameserver
```

### Example DNS Records

```
# Email (Google Workspace)
MX    @    1    aspmx.l.google.com
MX    @    5    alt1.aspmx.l.google.com
TXT   @    "v=spf1 include:_spf.google.com ~all"

# Domain verification
TXT   @    "google-site-verification=..."
TXT   @    "v=DMARC1; p=none; rua=mailto:..."

# Subdomain
CNAME api  api-server.example.com
```

## HTTPS/SSL Configuration

### Automatic SSL (Let's Encrypt)

Netlify automatically provisions and renews SSL certificates via Let's Encrypt.

**Requirements:**
- Domain must be properly configured
- DNS must be propagated
- No CAA records blocking Let's Encrypt

**CAA Record (if needed):**
```
CAA   @    0 issue "letsencrypt.org"
```

### Custom SSL Certificate

For custom certificates (e.g., EV certificates):

1. Go to **Site settings** > **Domain management** > **HTTPS**
2. Click **Provide your own certificate**
3. Upload:
   - Certificate (PEM format)
   - Private key (PEM format)
   - CA certificate chain (optional)

### Force HTTPS

```toml
# netlify.toml - Redirect HTTP to HTTPS
[[redirects]]
  from = "http://example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true
```

## Branch Subdomains

### Automatic Branch Deploys

Enable branch deploys in **Site settings** > **Build & deploy** > **Branches**:

- **All branches**: Deploy all branches
- **Specific branches**: Deploy only listed branches
- **None**: Only deploy production branch

### Branch Subdomain Format

```
# Format: branch-name--site-name.netlify.app
# Example: staging--my-site.netlify.app

# With custom domain (Netlify DNS required):
# staging.example.com
```

### Configure Branch Subdomains

```toml
# netlify.toml
[context.staging]
  command = "npm run build:staging"
  [context.staging.environment]
    API_URL = "https://api-staging.example.com"
```

## Deploy Preview Domains

### Default Format

```
# deploy-preview-{PR-number}--{site-name}.netlify.app
# Example: deploy-preview-42--my-site.netlify.app
```

### Custom Preview Domain

With Netlify DNS, you can set up custom preview domains:

1. Go to **Site settings** > **Domain management**
2. Click **Options** > **Set up automatic deploy subdomains**
3. Enter subdomain (e.g., `preview.example.com`)

Result: `deploy-preview-42.preview.example.com`

## Multiple Domains

### Domain Aliases

Add multiple domains pointing to the same site:

```bash
# Primary domain
example.com

# Aliases (redirect to primary)
www.example.com
old-domain.com
```

### Redirect Configuration

```toml
# netlify.toml - Redirect aliases to primary
[[redirects]]
  from = "https://www.example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://old-domain.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true
```

## Domain Troubleshooting

### Check DNS Propagation

```bash
# Check A record
dig example.com A

# Check CNAME
dig www.example.com CNAME

# Check nameservers
dig example.com NS

# Check from specific DNS server
dig @8.8.8.8 example.com A
```

### Common Issues

**SSL Certificate Not Provisioning:**
- Verify DNS is correctly configured
- Check for CAA records blocking Let's Encrypt
- Wait for DNS propagation (up to 48 hours)
- Check domain isn't on a blocklist

**Domain Not Resolving:**
- Verify nameserver delegation
- Check for typos in DNS records
- Ensure TTL has expired for old records

**Mixed Content Warnings:**
- Update all internal links to HTTPS
- Check for hardcoded HTTP URLs in code
- Use protocol-relative URLs or HTTPS

### Force SSL Renewal

If SSL certificate has issues:

1. Go to **Site settings** > **Domain management** > **HTTPS**
2. Click **Renew certificate**
3. Wait for provisioning (usually < 5 minutes)

## Security Headers

```toml
# netlify.toml - Security headers
[[headers]]
  for = "/*"
  [headers.values]
    # HTTPS enforcement
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

    # Prevent clickjacking
    X-Frame-Options = "DENY"

    # Prevent MIME sniffing
    X-Content-Type-Options = "nosniff"

    # XSS protection
    X-XSS-Protection = "1; mode=block"

    # Referrer policy
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Content Security Policy
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

## Domain Registration

Netlify offers domain registration:

1. Go to **Domains** in team dashboard
2. Search for available domain
3. Purchase and configure

**Benefits:**
- Automatic DNS configuration
- Automatic SSL
- Integrated management
- Auto-renewal
