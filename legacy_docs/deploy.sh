#!/bin/bash
# LegalOS 4.0 - Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  LegalOS 4.0 - Deployment Script${NC}"
echo -e "${BLUE}  Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}=============================================${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${RED}IMPORTANT: Please edit .env file with your configuration before deploying!${NC}"
    exit 1
fi

# Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check ports
    if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 80 is already in use"
    fi
    
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 8000 is already in use"
    fi
    
    # Check disk space
    AVAILABLE=$(df / | tail -1 | awk '{print $4}')
    if [ $AVAILABLE -lt 10485760 ]; then
        log_error "Insufficient disk space (less than 10GB available)"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build images
build_images() {
    log_info "Building Docker images..."
    docker-compose -f $COMPOSE_FILE build --no-cache
    log_success "Images built successfully"
}

# Start services
start_services() {
    log_info "Starting services..."
    docker-compose -f $COMPOSE_FILE up -d
    log_success "Services started"
}

# Wait for services to be healthy
wait_for_healthy() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for database
    until docker-compose -f $COMPOSE_FILE exec -T db pg_isready -U postgres; do
        log_info "Waiting for database..."
        sleep 2
    done
    log_success "Database is ready"
    
    # Wait for backend
    until curl -f http://localhost:8000/health > /dev/null 2>&1; do
        log_info "Waiting for backend..."
        sleep 2
    done
    log_success "Backend is ready"
    
    # Wait for frontend
    until curl -f http://localhost > /dev/null 2>&1; do
        log_info "Waiting for frontend..."
        sleep 2
    done
    log_success "Frontend is ready"
}

# Run migrations
run_migrations() {
    log_info "Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec -T backend alembic upgrade head || true
    log_success "Migrations completed"
}

# Show status
show_status() {
    echo -e "${BLUE}=============================================${NC}"
    echo -e "${GREEN}  Deployment Complete!${NC}"
    echo -e "${BLUE}=============================================${NC}"
    echo ""
    echo -e "${BLUE}Service Status:${NC}"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    echo -e "${BLUE}URLs:${NC}"
    echo -e "  Frontend: ${GREEN}http://localhost${NC}"
    echo -e "  Backend API: ${GREEN}http://localhost:8000${NC}"
    echo -e "  API Documentation: ${GREEN}http://localhost:8000/docs${NC}"
    echo -e "  Health Check: ${GREEN}http://localhost:8000/health${NC}"
    echo ""
    echo -e "${BLUE}Logs:${NC}"
    echo -e "  View logs: ${YELLOW}docker-compose -f $COMPOSE_FILE logs -f${NC}"
    echo -e "  Backend logs: ${YELLOW}docker-compose -f $COMPOSE_FILE logs -f backend${NC}"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo -e "  Stop: ${YELLOW}docker-compose -f $COMPOSE_FILE down${NC}"
    echo -e "  Restart: ${YELLOW}docker-compose -f $COMPOSE_FILE restart${NC}"
    echo -e "  Update: ${YELLOW}./deploy.sh${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    build_images
    start_services
    wait_for_healthy
    run_migrations
    show_status
}

# Handle cleanup on exit
cleanup() {
    echo ""
    log_info "Cleaning up..."
}

trap cleanup EXIT

# Run main function
main
