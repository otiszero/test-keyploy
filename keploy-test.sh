#!/bin/bash

# Keploy Testing Script for Realtime Chat Backend
# Usage: ./keploy-test.sh [record|test|clean]

set -e

NETWORK_NAME="keploy-network"
COMPOSE_FILE="docker-compose.keploy.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Keploy is installed
check_keploy() {
    if ! command -v keploy &> /dev/null; then
        print_error "Keploy is not installed!"
        echo "Install it with: curl --silent -O -L https://keploy.io/install.sh && source install.sh"
        exit 1
    fi
    print_status "Keploy version: $(keploy version 2>/dev/null | head -1)"
}

# Create Docker network if not exists
setup_network() {
    if ! docker network inspect $NETWORK_NAME &> /dev/null; then
        print_status "Creating Docker network: $NETWORK_NAME"
        docker network create $NETWORK_NAME
    else
        print_status "Docker network $NETWORK_NAME already exists"
    fi
}

# Start PostgreSQL first
start_postgres() {
    print_status "Starting PostgreSQL..."
    docker compose -f $COMPOSE_FILE up -d postgres
    
    print_status "Waiting for PostgreSQL to be healthy..."
    sleep 5
    
    # Wait for postgres to be ready
    until docker compose -f $COMPOSE_FILE exec -T postgres pg_isready -U chatuser -d realtime_chat; do
        sleep 2
    done
    print_status "PostgreSQL is ready!"
}

# Stop all services
stop_services() {
    print_status "Stopping all services..."
    docker compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null || true
}

# Record mode - capture API calls
record_mode() {
    print_status "Starting RECORD mode..."
    print_status "Make API calls to http://localhost:5000 to record test cases"
    print_warning "Press Ctrl+C to stop recording"
    
    setup_network
    start_postgres
    
    # Build backend image first
    print_status "Building backend image..."
    docker compose -f $COMPOSE_FILE build backend
    
    # Run Keploy in record mode
    keploy record -c "docker compose -f $COMPOSE_FILE up backend" \
        --container-name "backend" \
        --network "$NETWORK_NAME" \
        --buildDelay 30
}

# Test mode - replay recorded tests
test_mode() {
    print_status "Starting TEST mode..."
    
    if [ ! -d "keploy" ]; then
        print_error "No keploy directory found! Run record mode first."
        exit 1
    fi
    
    setup_network
    start_postgres
    
    # Build backend image first
    print_status "Building backend image..."
    docker compose -f $COMPOSE_FILE build backend
    
    # Run Keploy in test mode
    keploy test -c "docker compose -f $COMPOSE_FILE up backend" \
        --container-name "backend" \
        --network "$NETWORK_NAME" \
        --delay 10 \
        --buildDelay 30
}

# Clean up everything
clean_mode() {
    print_status "Cleaning up..."
    stop_services
    
    if [ -d "keploy" ]; then
        print_warning "Removing keploy directory..."
        rm -rf keploy
    fi
    
    print_status "Cleanup complete!"
}

# Show help
show_help() {
    echo "Keploy Testing Script for Realtime Chat Backend"
    echo ""
    echo "Usage: ./keploy-test.sh [command]"
    echo ""
    echo "Commands:"
    echo "  record    Start recording API calls as test cases"
    echo "  test      Run recorded test cases"
    echo "  clean     Remove all test data and stop services"
    echo "  help      Show this help message"
    echo ""
    echo "Example workflow:"
    echo "  1. ./keploy-test.sh record"
    echo "  2. Make API calls (register, login, etc.)"
    echo "  3. Press Ctrl+C to stop recording"
    echo "  4. ./keploy-test.sh test"
}

# Main
check_keploy

case "${1:-help}" in
    record)
        record_mode
        ;;
    test)
        test_mode
        ;;
    clean)
        clean_mode
        ;;
    help|*)
        show_help
        ;;
esac
