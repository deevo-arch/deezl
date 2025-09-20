#!/bin/bash

echo "🎵 Setting up Deezl Backend..."

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Installing yt-dlp..."
    
    # Try different installation methods
    if command -v pip3 &> /dev/null; then
        pip3 install yt-dlp
    elif command -v pip &> /dev/null; then
        pip install yt-dlp
    elif command -v brew &> /dev/null; then
        brew install yt-dlp
    else
        echo "❌ Please install yt-dlp manually:"
        echo "   pip install yt-dlp"
        echo "   or visit: https://github.com/yt-dlp/yt-dlp#installation"
        exit 1
    fi
else
    echo "✅ yt-dlp is already installed"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "🚀 Setup complete! Run 'npm start' to start the server."