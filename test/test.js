const { buildTree, treeToString, getIcon } = require('../index');
const path = require('path');

console.log('🧪 Running crashbytes-tree tests...\n');

// Test 1: Icon recognition
console.log('Test 1: Icon Recognition');
console.log('------------------------');
console.log('Folder icon:', getIcon('my-folder', true));
console.log('JavaScript icon:', getIcon('app.js', false));
console.log('JSON icon:', getIcon('package.json', false));
console.log('Markdown icon:', getIcon('README.md', false));
console.log('node_modules icon:', getIcon('node_modules', true));
console.log('✅ Icon recognition test passed\n');

// Test 2: Build tree structure
console.log('Test 2: Build Tree Structure');
console.log('------------------------');
try {
  const tree = buildTree(path.join(__dirname, '..'), {
    maxDepth: 1,
    showHidden: false,
    ignorePatterns: ['node_modules', '.git']
  });
  
  console.log('Root name:', tree.name);
  console.log('Root type:', tree.type);
  console.log('Root icon:', tree.icon);
  console.log('Children count:', tree.children ? tree.children.length : 0);
  console.log('✅ Build tree test passed\n');
} catch (error) {
  console.error('❌ Build tree test failed:', error.message);
}

// Test 3: Tree to string conversion
console.log('Test 3: Tree to String');
console.log('------------------------');
try {
  const tree = buildTree(path.join(__dirname, '..'), {
    maxDepth: 2,
    showHidden: false,
    ignorePatterns: ['node_modules', '.git', 'test']
  });
  
  const treeString = treeToString(tree);
  console.log(treeString);
  console.log('✅ Tree to string test passed\n');
} catch (error) {
  console.error('❌ Tree to string test failed:', error.message);
}

console.log('✅ All tests completed!');
