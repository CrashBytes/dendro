const { buildTree, renderTree } = require('../index');

// Basic usage example
const tree = buildTree('.', {
  maxDepth: 2,
  showHidden: false
});

const output = renderTree(tree, {
  showIcons: true,
  showPaths: false
});

console.log(output);
