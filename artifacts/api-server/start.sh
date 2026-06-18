#!/bin/bash

# Start API Server with Razorpay Integration
echo "Starting API Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Build and start the server
echo "Building and starting server..."
pnpm run dev

