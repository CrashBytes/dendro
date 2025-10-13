#!/bin/bash
set -e  # Exit on any error

# Configuration
VERSION=$(node -p "require('./package.json').version")

echo "🚀 Dendro v${VERSION} Production Deployment"
echo "========================================"
echo ""

# Phase 1: Pre-flight Validation
echo "📋 Phase 1: Pre-flight Validation"
echo "-----------------------------------"

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✓ Node.js: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
echo "✓ npm: $NPM_VERSION"

# Verify authentication
echo -n "✓ npm authentication: "
npm whoami

echo ""

# Phase 2: Test Suite Execution
echo "🧪 Phase 2: Test Suite Execution"
echo "-----------------------------------"
npm test

echo ""

# Phase 3: Package Validation
echo "📦 Phase 3: Package Validation"
echo "-----------------------------------"
echo "Package contents preview:"
npm pack --dry-run

echo ""

# Phase 4: Git Operations
echo "📝 Phase 4: Version Control"
echo "-----------------------------------"

# Check git status
if [[ -n $(git status -s) ]]; then
    echo "Committing changes..."
    git add package.json .gitignore
    git commit -m "chore: bump version to ${VERSION} - update repository links and secure credentials"
    echo "✓ Changes committed"
else
    echo "✓ Working directory clean"
fi

# Create and push tag
echo "Creating version tag v${VERSION}..."
git tag -f "v${VERSION}"
echo "✓ Tag created"

echo "Pushing to remote..."
git push origin main
git push origin "v${VERSION}" --force
echo "✓ Pushed to GitHub"

echo ""

# Phase 5: NPM Publication
echo "🚀 Phase 5: NPM Publication"
echo "-----------------------------------"
echo "Publishing @crashbytes/dendro@${VERSION}..."
npm publish --access public

echo ""

# Phase 6: Post-Deployment Verification
echo "✅ Phase 6: Post-Deployment Verification"
echo "-----------------------------------"
echo "Package details:"
npm view @crashbytes/dendro

echo ""
echo "=========================================="
echo "✨ Deployment Complete!"
echo "=========================================="
echo ""
echo "Verification commands:"
echo "  npm install -g @crashbytes/dendro@${VERSION}"
echo "  dendro --version"
echo ""
echo "Package URL:"
echo "  https://www.npmjs.com/package/@crashbytes/dendro"
echo ""
