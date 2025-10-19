#!/bin/bash
echo "==> FreshSip Backend Build Script"
echo "==> This is a Node.js backend - no frontend build required"
echo "==> Installing server dependencies..."

# Navigate to server directory and install dependencies
cd server
npm install

echo "==> Backend build completed successfully!"
echo "==> Server dependencies installed"
echo "==> Ready to start with 'npm start'"
