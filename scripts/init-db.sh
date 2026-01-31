#!/bin/bash
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
cd /app
alembic upgrade head

echo "Seeding database..."
python -m app.seed

echo "Database initialization complete!"
