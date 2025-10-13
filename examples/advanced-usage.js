const { buildTree, renderTree, getTreeStats } = require('../index');
const chalk = require('chalk');

// Advanced usage with custom options
console.log(chalk.bold.cyan('Advanced Directory Tree Example\n'));

const tree = buildTree('.', {
  maxDepth: 3,
  showHidden: true,
  excludePatterns: [
    /node_modules/,
    /\.git/,
    /dist/,
    /coverage/,
    /\.log$/
  ]
});

// Render with custom options
const output = renderTree(tree, {
  showIcons: true,
  showPaths: false
});

console.log(output);

// Get and display statistics
const stats = getTreeStats(tree);
console.log(chalk.dim(`\n📊 Statistics:`));
console.log(chalk.dim(`   Directories: ${stats.directories}`));
console.log(chalk.dim(`   Files: ${stats.files}`));
console.log(chalk.dim(`   Total items: ${stats.directories + stats.files}`));

// Custom filtering example
console.log(chalk.bold.yellow('\n\n🔍 JavaScript files only:\n'));

function filterJavaScriptFiles(node) {
  if (node.type === 'file') {
    const ext = node.name.split('.').pop();
    return ['js', 'jsx', 'ts', 'tsx'].includes(ext) ? node : null;
  }
  
  if (node.children) {
    const filteredChildren = node.children
      .map(filterJavaScriptFiles)
      .filter(Boolean);
    
    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
  }
  
  return null;
}

const jsTree = filterJavaScriptFiles(tree);
if (jsTree) {
  console.log(renderTree(jsTree, { showIcons: true }));
}
