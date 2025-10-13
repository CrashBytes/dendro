# Quick Start Guide - dendro 🌳

## What is dendro?

**dendro** (δένδρο) is Greek for "tree" - a beautiful CLI tool to visualize directory structures with file type icons.

## Installation

```bash
cd ~/github/crashbytes-tree
npm install
```

## Testing Methods

### Method 1: Run the test suite
```bash
npm test
```

### Method 2: Run CLI directly (no installation)
```bash
# Test on current directory
node bin/cli.js

# Test on crashbytes blog
node bin/cli.js ~/github/crashbytes

# Test with depth limit
node bin/cli.js ~/github/crashbytes -d 2

# Show all options
node bin/cli.js --help
```

### Method 3: Install globally (recommended)
```bash
npm link
```

Then use anywhere:
```bash
dendro
dendro ~/github/crashbytes -d 3
dendro . -a
```

### Method 4: Use with npx (after publishing)
```bash
npx dendro
```

## Common Test Commands

```bash
# Show 2 levels of current directory
node bin/cli.js -d 2

# Show all files including hidden
node bin/cli.js -a

# Exclude patterns
node bin/cli.js -e "test" "*.log"

# Show without icons
node bin/cli.js --no-icons

# Show with full paths
node bin/cli.js -p

# Visualize the dendro project itself
node bin/cli.js . -d 2
```

## Programmatic Usage

Create a test file:

```javascript
// my-test.js
const { buildTree, renderTree, getTreeStats } = require('./index');

const tree = buildTree('.', { maxDepth: 2 });
const output = renderTree(tree, { showIcons: true });
console.log(output);

const stats = getTreeStats(tree);
console.log(`\n${stats.directories} dirs, ${stats.files} files`);
```

Run it:
```bash
node my-test.js
```

## Publishing to NPM

When ready:
```bash
npm login
npm publish
```

## Why "dendro"?

- **δένδρο** (dendro) = Greek for "tree"
- Short, memorable, professional
- Used in science (dendrology, dendrochronology)
- Perfect for visualizing tree structures!
