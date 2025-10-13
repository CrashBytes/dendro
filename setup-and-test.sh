#!/bin/bash

echo "🌳 Setting up dendro package..."
echo ""

# Navigate to the package directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🧪 Running tests..."
echo ""
node test.js

echo ""
echo "📋 Available commands:"
echo ""
echo "  1. Test locally:"
echo "     node bin/cli.js"
echo ""
echo "  2. Test on a specific directory:"
echo "     node bin/cli.js ~/github/crashbytes -d 2"
echo ""
echo "  3. Install globally (link):"
echo "     npm link"
echo "     Then run: dendro"
echo ""
echo "  4. Show help:"
echo "     node bin/cli.js --help"
echo ""
echo "  5. Visualize the dendro project itself:"
echo "     node bin/cli.js . -d 2"
echo ""
