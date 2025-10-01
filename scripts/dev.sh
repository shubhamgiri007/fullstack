#!/bin/bash

# Development setup script for IdeaBoard

echo "🚀 Setting up IdeaBoard for development..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
docker run --name idea_board_dev_db \
  -e POSTGRES_DB=idea_board \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Start development servers
echo "🎯 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Database: localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"

npm run dev
