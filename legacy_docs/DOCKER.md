# LegalOS 4.0 - Docker Deployment Guide

Complete containerized deployment configuration for NyayaSahayak judicial platform.

## Quick Start

```bash
# 1. Clone and navigate to project
cd D:\Project\nationals

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your configuration
nano .env  # or use your preferred editor

# 4. Deploy
chmod +x deploy.sh
./deploy.sh
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                   (legalos-network)                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Nginx      │   Backend    │   Frontend   │    Redis       │
│   (80/443)   │   (8000)     │   (80)       │   (6379)       │
└──────────────┴──────────────┴──────────────┴────────────────┘
                      │
                      ▼
               PostgreSQL (5432)
```

## Services

### Backend (FastAPI)
- **Image**: Python 3.11 slim
- **Port**: 8000
- **Features**:
  - Multi-worker configuration (4 workers)
  - Health checks
  - Volume mounts for logs and uploads

### Frontend (React + Vite)
- **Image**: Node 20 + Nginx
- **Port**: 80/443
- **Features**:
  - Production-optimized build
  - Nginx reverse proxy
  - Static asset caching

### Database (PostgreSQL)
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5432
- **Features**:
  - Persistent volume storage
  - Health checks
  - Automated backups

### Cache (Redis)
- **Image**: Redis 7 Alpine
- **Port**: 6379
- **Features**:
  - AOF persistence
  - Memory limiting
  - LRU eviction policy

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | Secret for JWT tokens | `super-secret-key-32-chars` |
| `DB_PASSWORD` | PostgreSQL password | `secure-password` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | `production` | Deployment environment |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `REDIS_PASSWORD` | - | Redis authentication |
| `OPENAI_API_KEY` | - | AI service integration |

## Commands

### Deploy

```bash
# Full deployment
./deploy.sh

# Or manually:
docker-compose up -d --build
```

### Manage

```bash
# View logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Stop and remove volumes (WARNING: data loss)
docker-compose down -v
```

### Backup

```bash
# Run backup script
chmod +x backup.sh
./backup.sh

# Manual backup
docker-compose exec db pg_dump -U postgres legalos > backup.sql
```

## Production Checklist

- [ ] Change `JWT_SECRET_KEY` to strong random value
- [ ] Change `DB_PASSWORD` to secure password
- [ ] Configure `CORS_ORIGINS` with production domain
- [ ] Set up SSL/TLS certificates
- [ ] Enable firewall rules
- [ ] Configure log rotation
- [ ] Set up monitoring (Sentry/DataDog)
- [ ] Enable automated backups
- [ ] Configure email service
- [ ] Test disaster recovery

## SSL/TLS Setup

```bash
# Create SSL directory
mkdir -p ssl

# Copy certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Update nginx.conf to enable SSL
# Uncomment SSL section in nginx.conf

# Restart
docker-compose restart frontend
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill process or change port in docker-compose.yml
```

### Database Connection Failed

```bash
# Check database logs
docker-compose logs db

# Verify environment variables
cat .env | grep DATABASE

# Restart database
docker-compose restart db
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Verify dependencies
docker-compose exec backend pip list

# Run health check
curl http://localhost:8000/health
```

## Resource Requirements

| Service | CPU | Memory | Storage |
|---------|-----|--------|---------|
| Backend | 0.5 | 512MB | 1GB |
| Frontend | 0.25 | 256MB | 500MB |
| Database | 0.5 | 1GB | 10GB |
| Redis | 0.25 | 256MB | 500MB |
| **Total** | **1.5** | **2GB** | **12GB** |

## CI/CD Integration

GitHub Actions workflow included at `.github/workflows/ci-cd.yml`:

- Automated testing
- Security scanning
- Docker image building
- Container registry publishing

## Support

For issues and questions:
- Documentation: See `DOCUMENTATION_MASTER_INDEX.md`
- Architecture: See `EXPERT_IMPLEMENTATION_GUIDE.md`
- API Docs: `http://localhost:8000/docs`
