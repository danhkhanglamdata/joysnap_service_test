# Cloud Platforms

## AWS

### EC2 + Docker
```bash
# Install Docker on Amazon Linux 2
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Run container
docker run -d -p 80:3000 --restart=always myapp:latest
```

### ECS (Elastic Container Service)
```json
// task-definition.json
{
  "family": "myapp",
  "containerDefinitions": [{
    "name": "app",
    "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest",
    "portMappings": [{ "containerPort": 3000 }],
    "memory": 512,
    "cpu": 256
  }]
}
```

### S3 + CloudFront (Static Sites)
```bash
# Deploy React/Next.js static export
aws s3 sync ./out s3://my-bucket --delete
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

## GCP (Google Cloud Platform)

### Cloud Run (Serverless Containers)
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/myapp
gcloud run deploy myapp \
  --image gcr.io/PROJECT_ID/myapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### GCE (Compute Engine)
```bash
# Create VM with container
gcloud compute instances create-with-container myapp-vm \
  --container-image=gcr.io/PROJECT_ID/myapp \
  --machine-type=e2-micro \
  --zone=us-central1-a
```

### App Engine
```yaml
# app.yaml
runtime: nodejs20
env: standard
instance_class: F1
automatic_scaling:
  max_instances: 10
env_variables:
  NODE_ENV: production
```

## Azure

### Container Apps
```bash
# Create and deploy
az containerapp create \
  --name myapp \
  --resource-group mygroup \
  --environment myenv \
  --image myregistry.azurecr.io/myapp:latest \
  --target-port 3000 \
  --ingress external
```

### App Service
```bash
# Deploy from Docker Hub
az webapp create \
  --resource-group mygroup \
  --plan myplan \
  --name myapp \
  --deployment-container-image-name myapp:latest
```

### Static Web Apps (Frontend)
```yaml
# azure-pipelines.yml
trigger:
  - main
pool:
  vmImage: ubuntu-latest
steps:
  - task: AzureStaticWebApp@0
    inputs:
      app_location: '/'
      output_location: 'dist'
```

## Cloudflare

### Workers (Serverless)
```bash
# wrangler.toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Deploy
npx wrangler deploy
```

### Pages (Static/SSR)
```bash
# Connect to Git repo via dashboard, or:
npx wrangler pages deploy ./dist --project-name=myapp
```

## Platform Comparison

| Platform | Best For | Pricing Model | Cold Start |
|----------|----------|---------------|------------|
| AWS Lambda | Event-driven | Pay per request | ~100-500ms |
| AWS ECS | Containers | Per resource | None |
| GCP Cloud Run | Containers | Per request + CPU | ~100ms |
| Azure Container Apps | Containers | Per resource | ~200ms |
| Cloudflare Workers | Edge compute | Per request | <1ms |
| Vercel | Next.js | Per request | ~50ms |
