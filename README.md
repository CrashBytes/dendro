# dendro 🌳

[![npm version](https://badge.fury.io/js/%40crashbytes%2Fdendro.svg)](https://www.npmjs.com/package/@crashbytes/dendro)
[![npm downloads](https://img.shields.io/npm/dm/@crashbytes/dendro.svg)](https://npmjs.org/package/@crashbytes/dendro)
[![Node version](https://img.shields.io/node/v/@crashbytes/dendro.svg?style=flat)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/CrashBytes/dendro)](https://github.com/CrashBytes/dendro/issues)
[![GitHub stars](https://img.shields.io/github/stars/CrashBytes/dendro)](https://github.com/CrashBytes/dendro/stargazers)

**dendro** (δένδρο) - from the Greek word for "tree"

A beautiful, fast directory tree visualization CLI with intuitive file type icons.

📚 **[Documentation](https://crashbytes.github.io/dendro/)** | 🔗 **[GitHub Repository](https://github.com/CrashBytes/dendro)** | 📦 **[npm Package](https://www.npmjs.com/package/@crashbytes/dendro)**

> **Note:** Requires Node.js 20.0.0 or higher

---

## Why "dendro"?

The name **dendro** comes from the Greek word **δένδρο** (pronounced "DEN-droh"), meaning "tree". It's:

- **Memorable** - Short, unique, and easy to remember
- **Meaningful** - Directly relates to tree structures and hierarchies
- **Professional** - Used in scientific contexts (dendrology, dendrochronology)
- **Global** - Recognizable across languages due to its Greek root
- **Concise** - Just 6 letters, quick to type

When you visualize directory structures, you're essentially mapping a tree—and that's exactly what dendro does, with style.

---

## Features

- 🌳 Beautiful tree visualization with Unicode box-drawing characters
- 🎨 **Smart file type icons** for instant visual recognition
- ⚡ Lightning fast - optimized directory traversal
- 🎯 Flexible filtering with regex pattern support
- 📊 Built-in statistics (file counts, directory counts)
- 🔧 Both CLI and programmatic API
- 🎭 Smart defaults (auto-excludes node_modules, .git, etc.)

## Installation

### Via npm (Recommended)

```bash
npm install -g @crashbytes/dendro
```

### Via npx (No Installation)

```bash
npx @crashbytes/dendro
```

### From Source (GitHub)

```bash
git clone https://github.com/CrashBytes/dendro.git
cd dendro
npm install
npm link
```

## Quick Start

```bash
# Visualize current directory
dendro

# Visualize specific directory
dendro /path/to/project

# Limit depth to 3 levels
dendro ~/projects -d 3

# Show all files including hidden
dendro -a

# Show help
dendro --help
```

## Usage

### Command Line Options

```
Usage: dendro [path] [options]

Arguments:
  path                       Directory path to display (default: ".")

Options:
  -V, --version              Output version number
  -d, --max-depth <number>   Maximum depth to traverse
  -a, --all                  Show hidden files and directories
  --no-icons                 Disable file type icons
  -p, --show-paths           Show full paths
  -e, --exclude <patterns>   Patterns to exclude (regex)
  --no-stats                 Hide statistics summary
  -h, --help                 Display help
```

### Examples

```bash
# Show only 2 levels deep
dendro -d 2

# Show all files including hidden ones
dendro -a

# Exclude specific patterns (node_modules, test directories)
dendro -e "node_modules" "test" "__pycache__"

# Show full file paths
dendro -p

# Plain text output (no icons)
dendro --no-icons

# Combine options
dendro ~/my-project -d 3 -a -e "*.log" "dist"
```

## File Type Icons

dendro automatically detects and displays appropriate icons for common file types:

| Icon | File Types |
|------|-----------|
| 📁 | Directories |
| 📜 | JavaScript (.js, .jsx, .mjs, .cjs) |
| 📘 | TypeScript (.ts, .tsx) |
| 📋 | JSON (.json) |
| 📝 | Markdown (.md, .mdx) |
| 🎨 | Stylesheets (.css, .scss, .sass, .less) |
| 🌐 | HTML (.html, .htm) |
| 🖼️ | Images (.png, .jpg, .gif, .svg, .webp) |
| 🎬 | Videos (.mp4, .avi, .mov, .mkv) |
| 🎵 | Audio (.mp3, .wav, .ogg, .m4a) |
| 📕 | PDFs (.pdf) |
| 🗜️ | Archives (.zip, .tar, .gz, .rar, .7z) |
| 🗄️ | Databases (.db, .sqlite, .sql) |
| ⚙️ | Config files (.yaml, .yml, .toml, .ini) |
| 🔒 | Lock files (package-lock.json, yarn.lock) |
| 📦 | Git files (.gitignore, .gitattributes) |
| 📄 | Other text files |

## Programmatic API

Use dendro in your Node.js projects:

```javascript
const { buildTree, renderTree, getTreeStats } = require('@crashbytes/dendro');

// Build a tree structure
const tree = buildTree('/path/to/directory', {
  maxDepth: 3,
  showHidden: false,
  excludePatterns: [/node_modules/, /\.git/]
});

// Render as text
const output = renderTree(tree, {
  showIcons: true,
  showPaths: false
});

console.log(output);

// Get statistics
const stats = getTreeStats(tree);
console.log(`${stats.directories} directories, ${stats.files} files`);
```

### API Reference

#### `buildTree(dirPath, options)`

Builds a tree data structure from a directory.

**Parameters:**
- `dirPath` (string) - Path to directory
- `options` (object)
  - `maxDepth` (number) - Maximum depth to traverse (default: Infinity)
  - `showHidden` (boolean) - Include hidden files (default: false)
  - `excludePatterns` (RegExp[]) - Patterns to exclude (default: [])

**Returns:** Tree object with structure:
```javascript
{
  name: string,
  type: 'file' | 'directory',
  icon: string,
  path: string,
  children?: TreeNode[]
}
```

#### `renderTree(tree, options)`

Renders a tree structure as formatted text.

**Parameters:**
- `tree` (object) - Tree structure from buildTree
- `options` (object)
  - `showIcons` (boolean) - Display file type icons (default: true)
  - `showPaths` (boolean) - Display full paths (default: false)
  - `prefix` (string) - Internal use for recursion
  - `isLast` (boolean) - Internal use for recursion

**Returns:** Formatted string representation

#### `getTreeStats(tree)`

Calculates statistics for a tree.

**Returns:** Object with `{ files: number, directories: number }`

## Default Exclusions

By default (without `-a` flag), dendro excludes:
- Hidden files/directories (starting with `.`)
- `node_modules`
- `.git`
- `.DS_Store`
- `dist`
- `build`
- `coverage`

Override with `-a` or use `-e` to add custom exclusions.

## Advanced Usage

### Custom Filtering

```javascript
const { buildTree, renderTree } = require('@crashbytes/dendro');

// Build tree
const tree = buildTree('.', { maxDepth: 3 });

// Filter to show only JavaScript files
function filterJS(node) {
  if (node.type === 'file') {
    return /\.(js|jsx|ts|tsx)$/.test(node.name) ? node : null;
  }
  
  if (node.children) {
    const filtered = node.children.map(filterJS).filter(Boolean);
    return filtered.length > 0 ? { ...node, children: filtered } : null;
  }
  
  return null;
}

const jsOnly = filterJS(tree);
console.log(renderTree(jsOnly));
```

### Integration with Build Tools

```javascript
// In your build script
const { buildTree, getTreeStats } = require('@crashbytes/dendro');

const tree = buildTree('./dist');
const stats = getTreeStats(tree);

console.log(`Build output: ${stats.files} files in ${stats.directories} directories`);
```

## Examples

See the [`/examples`](https://github.com/CrashBytes/dendro/tree/main/examples) directory for more usage examples:
- `basic-usage.js` - Simple tree visualization
- `advanced-usage.js` - Custom filtering and statistics

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository** on [GitHub](https://github.com/CrashBytes/dendro)
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/dendro.git
   cd dendro
   npm install
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and test them
   ```bash
   npm test
   node bin/cli.js
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** on GitHub

### Areas for Contribution

- 🎨 Add more file type icons
- ⚡ Performance optimizations
- 📝 Documentation improvements
- 🐛 Bug fixes
- ✨ New features

## Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/CrashBytes/dendro/issues).

When reporting bugs, please include:
- Your OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Development

### Running Tests

```bash
npm test
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/CrashBytes/dendro.git
cd dendro

# Install dependencies
npm install

# Link for local testing
npm link

# Make changes and test
dendro ~/test-directory
```

## Changelog

See [CHANGELOG.md](https://github.com/CrashBytes/dendro/blob/main/CHANGELOG.md) for version history.

## License

MIT License - see [LICENSE](https://github.com/CrashBytes/dendro/blob/main/LICENSE) file for details.

## Author

**CrashBytes**
- Website: [crashbytes.com](https://crashbytes.com)
- GitHub: [@CrashBytes](https://github.com/CrashBytes)
- Twitter: [@crashbytes](https://twitter.com/crashbytes)

## Acknowledgments

Special thanks to all [contributors](https://github.com/CrashBytes/dendro/graphs/contributors) who help make dendro better!

---

## Support

If you find dendro useful, please:
- ⭐ Star the project on [GitHub](https://github.com/CrashBytes/dendro)
- 🐦 Share it on social media
- 📝 Write a blog post about it
- 💬 Tell your developer friends

---

*dendro - Because every great project starts with understanding its structure* 🌳
