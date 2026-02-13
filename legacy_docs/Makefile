# LegalOS 4.0 - Makefile
# Common development and deployment tasks

.PHONY: help build up down logs shell test lint clean deploy backup

# Default target
help:
	@echo "LegalOS 4.0 - Available Commands"
	@echo "=================================="
	@echo "make dev          - Start development environment"
	@echo "make build        - Build all Docker images"
	@echo "make up           - Start production environment"
	@echo "make down         - Stop all services"
	@echo "make logs         - View logs from all services"
	@echo "make shell        - Open shell in backend container"
	@echo "make test         - Run all tests"
	@echo "make lint         - Run linting on all code"
	@echo "make clean        - Remove all containers and volumes"
	@echo "make deploy       - Deploy to production"
	@echo "make backup       - Create backup"

# Development
dev:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Build images
build:
	docker-compose build --no-cache

# Production
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

# Shell access
shell:
	docker-compose exec backend /bin/bash

shell-db:
	docker-compose exec db psql -U postgres legalos

# Testing
test:
	@echo "Running backend tests..."
	docker-compose exec backend pytest -v
	test-frontend:
	@echo "Running frontend tests..."
	docker-compose exec frontend npm test

# Linting
lint:
	@echo "Linting backend..."
	docker-compose exec backend flake8 app/
	@echo "Linting frontend..."
	docker-compose exec frontend npm run lint

# Cleanup
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Deployment
deploy:
	./deploy.sh

# Backup
backup:
	./backup.sh

# Database operations
migrate:
	docker-compose exec backend alembic upgrade head

makemigrations:
	docker-compose exec backend alembic revision --autogenerate -m "$(message)"

# Monitoring
status:
	docker-compose ps

df:
	docker system df
