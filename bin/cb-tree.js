#!/usr/bin/env node

const path = require('path');
const dirTree = require('../index');

const args = process.argv.slice(2);
const options = {
  all: false,
  depth: Infinity,
  dirsOnly: false,
  exclude: []
};

let targetPath = process.cwd();

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '-a' || arg === '--all') {
    options.all = true;
  } else if (arg === '-d' || arg === '--dirs-only') {
    options.dirsOnly = true;
  } else if (arg === '-L' || arg === '--level') {
    options.depth = parseInt(args[++i]);
  } else if (arg === '-I' || arg === '--exclude') {
    options.exclude.push(args[++i]);
  } else if (arg === '-h' || arg === '--help') {
    showHelp();
    process.exit(0);
  } else if (!arg.startsWith('-')) {
    targetPath = path.resolve(arg);
  }
}

function showHelp() {
  console.log(`
crashbytes-tree - A beautiful directory tree with file type icons

Usage: cb-tree [options] [path]

Options:
  -a, --all           Show hidden files (starting with .)
  -d, --dirs-only     List directories only
  -L, --level <n>     Maximum depth of directory tree
  -I, --exclude <pattern>  Exclude files/directories matching pattern
  -h, --help          Show this help message

Examples:
  cb-tree                    # Show tree of current directory
  cb-tree /path/to/dir       # Show tree of specific directory
  cb-tree -L 2               # Show tree with max depth of 2
  cb-tree -a -L 3            # Show tree including hidden files, max depth 3
  cb-tree -d                 # Show directories only
  `);
}

try {
  console.log(dirTree(targetPath, options));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
