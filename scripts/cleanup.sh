#!/bin/bash

# Cleanup script for IdeaBoard

echo "🧹 Cleaning up IdeaBoard containers and volumes..."

# Stop and remove containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove development database container
echo "🗑️ Removing development database container..."
docker rm -f idea_board_dev_db 2>/dev/null || true

# Remove volumes (optional - uncomment if you want to reset database)
# echo "🗑️ Removing database volumes..."
# docker volume rm assessment-2_postgres_data 2>/dev/null || true

echo "✅ Cleanup complete!"
echo ""
echo "To start fresh:"
echo "  docker-compose up --build"
echo ""
echo "Or for development:"
echo "  ./scripts/dev.sh"
